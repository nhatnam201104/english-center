import prisma from "../config/database";

// ─── Get Course Registration Statistics for Current Month ───

export const getCourseRegistrationStatsService = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get completed enrollments in current month
  const enrollments = await prisma.enrollmentDraft.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      seatReservation: {
        include: {
          schedule: {
            include: {
              course: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  sale: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Group by course
  const courseStats: Record<string, { name: string; count: number; price: number; sale: number }> = {};

  for (const enrollment of enrollments) {
    const schedule = enrollment.seatReservation?.schedule;
    if (!schedule) continue;

    const course = schedule.course;
    const courseKey = course.id.toString();

    if (!courseStats[courseKey]) {
      courseStats[courseKey] = {
        name: course.name,
        count: 0,
        price: Number(course.price),
        sale: course.sale,
      };
    }
    courseStats[courseKey].count += 1;
  }

  // Convert to array and calculate percentages
  const totalRegistrations = Object.values(courseStats).reduce((sum, c) => sum + c.count, 0);

  const courseData = Object.entries(courseStats).map(([id, stats]) => ({
    courseId: parseInt(id),
    courseName: stats.name,
    registrationCount: stats.count,
    price: stats.price,
    sale: stats.sale,
    finalPrice: Math.round(stats.price * (1 - stats.sale / 100)),
    percentage: totalRegistrations > 0 ? Math.round((stats.count / totalRegistrations) * 100) : 0,
  }));

  // Sort by registration count descending
  courseData.sort((a, b) => b.registrationCount - a.registrationCount);

  return {
    totalRegistrations,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    courses: courseData,
  };
};

// ─── Get Revenue Statistics by Course ───

export const getRevenueStatsService = async (courseId?: number) => {
  // Build where clause for payments
  const whereClause: any = {
    status: "SUCCESS",
    finalizedAt: { not: null },
  };

  if (courseId) {
    whereClause.enrollmentDraft = {
      seatReservation: {
        schedule: {
          coursesId: courseId,
        },
      },
    };
  }

  // Get all successful payments with course info
  const payments = await prisma.paymentTransaction.findMany({
    where: whereClause,
    include: {
      enrollmentDraft: {
        include: {
          seatReservation: {
            include: {
              schedule: {
                include: {
                  course: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                      sale: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { finalizedAt: "desc" },
  });

  // Group by course
  const courseRevenue: Record<string, { 
    courseId: number; 
    courseName: string; 
    totalAmount: number; 
    transactionCount: number;
    price: number;
    sale: number;
  }> = {};

  for (const payment of payments) {
    const schedule = payment.enrollmentDraft?.seatReservation?.schedule;
    if (!schedule) continue;

    const course = schedule.course;
    const courseKey = course.id.toString();

    if (!courseRevenue[courseKey]) {
      courseRevenue[courseKey] = {
        courseId: course.id,
        courseName: course.name,
        totalAmount: 0,
        transactionCount: 0,
        price: Number(course.price),
        sale: course.sale,
      };
    }
    courseRevenue[courseKey].totalAmount += payment.amount;
    courseRevenue[courseKey].transactionCount += 1;
  }

  // Convert to array and sort by revenue
  const revenueData = Object.values(courseRevenue)
    .map(rev => ({
      ...rev,
      finalPrice: Math.round(rev.price * (1 - rev.sale / 100)),
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.totalAmount, 0);

  return {
    totalRevenue,
    transactionCount: payments.length,
    courses: revenueData,
  };
};

export const getRevenueStatsByUserService = async (
  userId: number,
  role: string,
  courseId?: number,
) => {
  const whereClause: any = {
    status: "SUCCESS",
    finalizedAt: { not: null },
  };

  if (courseId) {
    whereClause.enrollmentDraft = {
      seatReservation: {
        schedule: {
          coursesId: courseId,
        },
      },
    };
  }

  if (role === "STUDENT") {
    whereClause.OR = [{ studentUserId: userId }, { payerUserId: userId }];
  }

  if (role === "PARENT") {
    const parent = await prisma.parentInfo.findUnique({
      where: { userId },
      include: {
        students: {
          include: {
            student: {
              select: { userId: true },
            },
          },
        },
      },
    });

    const childUserIds = parent?.students
      .map((item) => item.student.userId)
      .filter((id) => Boolean(id));

    whereClause.OR = [
      { payerUserId: userId },
      {
        studentUserId: {
          in: childUserIds && childUserIds.length > 0 ? childUserIds : [-1],
        },
      },
    ];
  }

  const payments = await prisma.paymentTransaction.findMany({
    where: whereClause,
    include: {
      studentUser: {
        select: {
          id: true,
          fullname: true,
          email: true,
        },
      },
      payerUser: {
        select: {
          id: true,
          fullname: true,
          email: true,
        },
      },
      enrollmentDraft: {
        include: {
          seatReservation: {
            include: {
              schedule: {
                include: {
                  course: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                      sale: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { finalizedAt: "desc" },
  });

  const courseRevenue: Record<
    string,
    {
      courseId: number;
      courseName: string;
      totalAmount: number;
      transactionCount: number;
      price: number;
      sale: number;
    }
  > = {};

  const userRevenue: Record<
    string,
    {
      userId: number;
      role: "STUDENT" | "PARENT";
      fullname: string;
      email: string;
      totalAmount: number;
      transactionCount: number;
    }
  > = {};

  for (const payment of payments) {
    const schedule = payment.enrollmentDraft?.seatReservation?.schedule;
    if (!schedule) continue;

    const course = schedule.course;
    const courseKey = course.id.toString();

    if (!courseRevenue[courseKey]) {
      courseRevenue[courseKey] = {
        courseId: course.id,
        courseName: course.name,
        totalAmount: 0,
        transactionCount: 0,
        price: Number(course.price),
        sale: course.sale,
      };
    }

    courseRevenue[courseKey].totalAmount += payment.amount;
    courseRevenue[courseKey].transactionCount += 1;

    if (payment.studentUser) {
      const studentKey = `STUDENT-${payment.studentUser.id}`;
      if (!userRevenue[studentKey]) {
        userRevenue[studentKey] = {
          userId: payment.studentUser.id,
          role: "STUDENT",
          fullname: payment.studentUser.fullname,
          email: payment.studentUser.email,
          totalAmount: 0,
          transactionCount: 0,
        };
      }
      userRevenue[studentKey].totalAmount += payment.amount;
      userRevenue[studentKey].transactionCount += 1;
    }

    if (payment.payerUser) {
      const parentKey = `PARENT-${payment.payerUser.id}`;
      if (!userRevenue[parentKey]) {
        userRevenue[parentKey] = {
          userId: payment.payerUser.id,
          role: "PARENT",
          fullname: payment.payerUser.fullname,
          email: payment.payerUser.email,
          totalAmount: 0,
          transactionCount: 0,
        };
      }
      userRevenue[parentKey].totalAmount += payment.amount;
      userRevenue[parentKey].transactionCount += 1;
    }
  }

  const revenueByCourse = Object.values(courseRevenue)
    .map((item) => ({
      ...item,
      finalPrice: Math.round(item.price * (1 - item.sale / 100)),
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const revenueByUser = Object.values(userRevenue).sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  const totalRevenue = revenueByCourse.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    totalRevenue,
    transactionCount: payments.length,
    courses: revenueByCourse,
    users: revenueByUser,
  };
};

// ─── Get All Courses for Filter ───

export const getAllCoursesForFilterService = async () => {
  const courses = await prisma.course.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      price: true,
      sale: true,
    },
    orderBy: { name: "asc" },
  });

  return courses.map(c => ({
    id: c.id,
    name: c.name,
    price: Number(c.price),
    sale: c.sale,
    finalPrice: Math.round(Number(c.price) * (1 - c.sale / 100)),
  }));
};

// ─── Get Admission Students (with pagination) ───

interface GetAdmissionStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAdmissionStudentsService = async ({ page = 1, limit = 10, search = "" }: GetAdmissionStudentsParams) => {
  const skip = (page - 1) * limit;
  
  // Build where clause
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { fullname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { cccd: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count
  const total = await prisma.admission.count({ where: whereClause });

  // Get students
  const students = await prisma.admission.findMany({
    where: whereClause,
    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
      cccd: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return {
    data: students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
