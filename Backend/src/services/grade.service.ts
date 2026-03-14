import prisma from "../config/database";

export interface GradeData {
  id: number;
  courseName: string;
  participationScore: number;
  examScore: number;
  finalScore: number;
  status: "PASS" | "FAIL" | "NOT_GRADED";
  gradedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetGradesResult {
  data: GradeData[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getStudentGradesService = async (
  studentId: number,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {}
): Promise<GetGradesResult> => {
  const where = {
    studentId,
    student: {
      deletedAt: null,
    },
  };

  const totalItems = await prisma.grade.count({ where });

  const grades = await prisma.grade.findMany({
    where,
    include: {
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const data: GradeData[] = grades.map((grade) => ({
    id: grade.id,
    courseName: grade.course.name,
    participationScore: grade.participationScore ?? 0,
    examScore: grade.examScore ?? 0,
    finalScore: grade.finalScore ?? 0,
    status: grade.status as "PASS" | "FAIL" | "NOT_GRADED",
    gradedAt: grade.gradedAt,
    createdAt: grade.createdAt,
    updatedAt: grade.updatedAt,
  }));

  return {
    data,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    page,
    limit,
  };
};