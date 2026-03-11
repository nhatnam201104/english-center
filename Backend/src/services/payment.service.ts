import prisma from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { buildPaymentUrl, verifyIpn, verifyReturnUrl, formatVnpDate } from "../utils/vnpay.helper";
import { finalizeEnrollmentService } from "./enrollment.service";

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
