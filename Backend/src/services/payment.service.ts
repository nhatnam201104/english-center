import prisma from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { buildPaymentUrl, verifyIpn, verifyReturnUrl, formatVnpDate } from "../utils/vnpay.helper";
import { finalizeEnrollmentService } from "./enrollment.service";

type PaymentRequester = {
  id: number;
  role: string;
  email?: string;
};

type PaymentHistoryQuery = {
  page: number;
  limit: number;
  status?: string;
};

const buildAccessiblePaymentWhere = async (requester: PaymentRequester) => {
  if (requester.role === "ADMIN") {
    return {};
  }

  if (requester.role === "STUDENT") {
    const student = await prisma.studentInfo.findUnique({
      where: { userId: requester.id },
      include: { user: true },
    });

    if (!student) {
      throw new AppError("Không tìm thấy thông tin học sinh", 404);
    }

    return {
      enrollmentDraft: {
        admission: {
          email: student.user.email,
        },
      },
    };
  }

  if (requester.role === "PARENT") {
    const parent = await prisma.parentInfo.findUnique({
      where: { userId: requester.id },
      include: {
        user: true,
        students: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!parent) {
      throw new AppError("Không tìm thấy thông tin phụ huynh", 404);
    }

    const studentEmails = parent.students.map((item) => item.student.user.email);

    return {
      OR: [
        {
          enrollmentDraft: {
            admission: {
              email: {
                in: studentEmails.length > 0 ? studentEmails : ["__NO_MATCH__"],
              },
            },
          },
        },
        {
          enrollmentDraft: {
            parentData: {
              path: ["email"],
              equals: parent.user.email,
            },
          },
        },
      ],
    };
  }

  throw new AppError("Bạn không có quyền truy cập dữ liệu thanh toán", 403);
};

// ─── Create Payment URL ───

export const createPaymentUrlService = async (
  draftId: number,
  ipAddr: string,
) => {
  const draft = await prisma.enrollmentDraft.findUnique({
    where: { id: Number(draftId) },
    include: {
      seatReservation: true,
      payment: true,
      admission: true,
    },
  });

  if (!draft) {
    throw new AppError("Không tìm thấy đơn đăng ký", 404);
  }

  if (draft.status === "COMPLETED") {
    throw new AppError("Đơn đăng ký đã hoàn tất", 400);
  }

  if (draft.expiresAt < new Date()) {
    throw new AppError("Đơn đăng ký đã hết hạn", 400);
  }

  // If there's already a pending payment, return existing
  if (draft.payment && draft.payment.status === "PENDING") {
    const existingUrl = buildPaymentUrl({
      txnRef: draft.payment.txnRef,
      amount: draft.payment.amount,
      orderInfo: `Thanh toan khoa hoc ${draft.payment.txnRef}`,
      ipAddr,
      returnUrl: process.env.VNP_RETURN_URL!,
    });

    return {
      paymentUrl: existingUrl,
      txnRef: draft.payment.txnRef,
      expiresAt: draft.expiresAt,
    };
  }

  // Get course price from schedule
  const schedule = await prisma.schedule.findUnique({
    where: { id: draft.scheduleId! },
    include: { course: true },
  });

  if (!schedule) {
    throw new AppError("Lịch học không tồn tại", 404);
  }

  const coursePrice = Number(schedule.course.price);
  const sale = schedule.course.sale ?? 0;
  const finalAmount = Math.round(coursePrice * (1 - sale / 100));

  // Generate unique txnRef: timestamp + draftId
  const now = new Date();
  const createDate = formatVnpDate(now);
  const txnRef = `${createDate}_${draftId}`;

  // Create payment transaction
  const payment = await prisma.$transaction(async (tx) => {
    // Update draft status
    await tx.enrollmentDraft.update({
      where: { id: Number(draftId) },
      data: { status: "PENDING_PAYMENT" },
    });

    // Create payment record
    const paymentTx = await tx.paymentTransaction.create({
      data: {
        enrollmentDraftId: Number(draftId),
        txnRef,
        amount: finalAmount,
        status: "PENDING",
        vnpCreateDate: createDate,
      },
    });

    return paymentTx;
  });

  const paymentUrl = buildPaymentUrl({
    txnRef: payment.txnRef,
    amount: payment.amount,
    orderInfo: `Thanh toan khoa hoc ${payment.txnRef}`,
    ipAddr,
    returnUrl: process.env.VNP_RETURN_URL!,
  });

  return {
    paymentUrl,
    txnRef: payment.txnRef,
    expiresAt: draft.expiresAt,
  };
};

// ─── IPN Handler (server-to-server from VNPay) ───

export const ipnHandlerService = async (
  query: Record<string, string>,
): Promise<{ RspCode: string; Message: string }> => {
  // 1. Verify checksum using the official library
  const ipnResult = verifyIpn(query);
  if (!ipnResult.isVerified) {
    return { RspCode: "97", Message: "Invalid Checksum" };
  }

  const txnRef = ipnResult.vnp_TxnRef ?? query["vnp_TxnRef"];
  // vnp_Amount from library is already divided by 100
  const vnpAmount = Number(ipnResult.vnp_Amount ?? 0);
  const vnpResponseCode = query["vnp_ResponseCode"];
  const vnpTransactionNo = query["vnp_TransactionNo"];
  const vnpBankCode = query["vnp_BankCode"];
  const vnpPayDate = query["vnp_PayDate"];

  // 2. Find payment transaction
  const payment = await prisma.paymentTransaction.findUnique({
    where: { txnRef },
    include: { enrollmentDraft: true },
  });

  if (!payment) {
    return { RspCode: "01", Message: "Order not found" };
  }

  // 3. Verify amount
  if (payment.amount !== vnpAmount) {
    return { RspCode: "04", Message: "Invalid Amount" };
  }

  // 4. Check if already processed (idempotent)
  if (payment.status === "SUCCESS") {
    return { RspCode: "00", Message: "Confirm Success" };
  }

  if (payment.status !== "PENDING") {
    return { RspCode: "02", Message: "Order already confirmed" };
  }

  // 5. Process based on response code
  if (vnpResponseCode === "00") {
    // Payment successful — finalize enrollment
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        vnpTransactionNo,
        vnpBankCode,
        vnpPayDate,
        vnpResponseCode,
        ipnReceivedAt: new Date(),
        finalizedAt: new Date(),
      },
    });

    // Finalize enrollment (create user, student, schedule registration)
    try {
      await finalizeEnrollmentService(payment.enrollmentDraftId);
    } catch (err) {
      console.error("Finalize enrollment error:", err);
      // Still return success to VNPay — payment was received
    }

    return { RspCode: "00", Message: "Confirm Success" };
  } else {
    // Payment failed
    await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        vnpResponseCode,
        vnpTransactionNo,
        vnpBankCode,
        vnpPayDate,
        ipnReceivedAt: new Date(),
      },
    });

    await prisma.enrollmentDraft.update({
      where: { id: payment.enrollmentDraftId },
      data: { status: "FAILED" },
    });

    // Release seat reservation
    await prisma.seatReservation.updateMany({
      where: {
        enrollmentDraftId: payment.enrollmentDraftId,
        status: "ACTIVE",
      },
      data: { status: "CANCELLED" },
    });

    return { RspCode: "00", Message: "Confirm Success" };
  }
};

// ─── Return URL Handler (browser redirect from VNPay) ───

export const returnHandlerService = async (
  query: Record<string, string>,
) => {
  const result = verifyReturnUrl(query);
  const txnRef = result.vnp_TxnRef ?? query["vnp_TxnRef"];
  const vnpResponseCode = query["vnp_ResponseCode"];
  const vnpTransactionNo = query["vnp_TransactionNo"];
  const vnpBankCode = query["vnp_BankCode"];
  const vnpPayDate = query["vnp_PayDate"];

  const signatureValid = result.isVerified;
  const paymentSuccess = result.isVerified && result.isSuccess && vnpResponseCode === "00";

  // When IPN cannot reach the server (e.g. localhost dev), finalize here.
  // Idempotent: only acts when status is still PENDING.
  if (txnRef && paymentSuccess) {
    const payment = await prisma.paymentTransaction.findUnique({
      where: { txnRef },
    });

    if (payment && payment.status === "PENDING") {
      await prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          vnpTransactionNo,
          vnpBankCode,
          vnpPayDate,
          vnpResponseCode,
          ipnReceivedAt: new Date(),
          finalizedAt: new Date(),
        },
      });

      try {
        await finalizeEnrollmentService(payment.enrollmentDraftId);
      } catch (err) {
        console.error("[ReturnURL] Finalize enrollment error:", err);
      }
    }
  } else if (txnRef && signatureValid && vnpResponseCode && vnpResponseCode !== "00") {
    // Payment was cancelled/failed from VNPay side — mark it
    const payment = await prisma.paymentTransaction.findUnique({
      where: { txnRef },
    });
    if (payment && payment.status === "PENDING") {
      await prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          vnpResponseCode,
          vnpTransactionNo,
          vnpBankCode,
          vnpPayDate,
          ipnReceivedAt: new Date(),
        },
      });
      await prisma.enrollmentDraft.update({
        where: { id: payment.enrollmentDraftId },
        data: { status: "FAILED" },
      });
      await prisma.seatReservation.updateMany({
        where: { enrollmentDraftId: payment.enrollmentDraftId, status: "ACTIVE" },
        data: { status: "CANCELLED" },
      });
    }
  }

  return {
    isValid: signatureValid,
    txnRef,
    responseCode: vnpResponseCode,
    success: paymentSuccess,
  };
};

// ─── Payment History ───

export const getPaymentHistoryService = async (
  requester: PaymentRequester,
  query: PaymentHistoryQuery,
) => {
  const page = query.page > 0 ? query.page : 1;
  const limit = query.limit > 0 ? query.limit : 10;
  const skip = (page - 1) * limit;

  const accessibleWhere = await buildAccessiblePaymentWhere(requester);

  const where = {
    ...accessibleWhere,
    ...(query.status ? { status: query.status as any } : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.paymentTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        enrollmentDraft: {
          include: {
            admission: true,
            seatReservation: {
              include: {
                schedule: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.paymentTransaction.count({ where }),
  ]);

  return {
    data: items.map((payment) => ({
      id: payment.id,
      txnRef: payment.txnRef,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      finalizedAt: payment.finalizedAt,
      studentName: payment.enrollmentDraft.admission.fullname,
      studentEmail: payment.enrollmentDraft.admission.email,
      courseName: payment.enrollmentDraft.seatReservation?.schedule.course.name,
    })),
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

// ─── Invoice Detail by TxnRef ───

export const getPaymentInvoiceService = async (
  requester: PaymentRequester,
  txnRef: string,
) => {
  if (!txnRef) {
    throw new AppError("TxnRef không hợp lệ", 400);
  }

  const accessibleWhere = await buildAccessiblePaymentWhere(requester);

  const payment = await prisma.paymentTransaction.findFirst({
    where: {
      txnRef,
      ...accessibleWhere,
    },
    include: {
      enrollmentDraft: {
        include: {
          admission: true,
          seatReservation: {
            include: {
              schedule: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Không tìm thấy hóa đơn", 404);
  }

  const schedule = payment.enrollmentDraft.seatReservation?.schedule;
  const course = schedule?.course;
  const rawPrice = course ? Number(course.price) : null;
  const salePercent = course?.sale ?? 0;

  return {
    txnRef: payment.txnRef,
    paymentId: payment.id,
    status: payment.status,
    amount: payment.amount,
    paidAt: payment.finalizedAt,
    paymentMeta: {
      vnpTransactionNo: payment.vnpTransactionNo,
      vnpBankCode: payment.vnpBankCode,
      vnpPayDate: payment.vnpPayDate,
      vnpResponseCode: payment.vnpResponseCode,
    },
    student: {
      fullname: payment.enrollmentDraft.admission.fullname,
      email: payment.enrollmentDraft.admission.email,
      phone: payment.enrollmentDraft.admission.phone,
    },
    course: course
      ? {
          id: course.id,
          name: course.name,
          originalPrice: rawPrice,
          salePercent,
          finalPrice: payment.amount,
        }
      : null,
    schedule: schedule
      ? {
          id: schedule.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        }
      : null,
  };
};
