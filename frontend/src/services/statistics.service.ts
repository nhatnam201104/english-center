import axiosInstance from "../configs/axios.config";

export type StatisticsPeriodType = "day" | "month" | "year";

export interface StatisticsPeriodFilter {
  periodType: StatisticsPeriodType;
  date?: string;
  month?: string;
  year?: number;
}

export interface CourseRegistrationStats {
  totalRegistrations: number;
  month: number;
  year: number;
  periodType: StatisticsPeriodType;
  periodLabel: string;
  courses: {
    courseId: number;
    courseName: string;
    registrationCount: number;
    price: number;
    sale: number;
    finalPrice: number;
    percentage: number;
  }[];
}

export interface RevenueStats {
  totalRevenue: number;
  transactionCount: number;
  periodType: StatisticsPeriodType;
  periodLabel: string;
  courses: {
    courseId: number;
    courseName: string;
    totalAmount: number;
    transactionCount: number;
    price: number;
    sale: number;
    finalPrice: number;
  }[];
}

export interface CourseForFilter {
  id: number;
  name: string;
  price: number;
  sale: number;
  finalPrice: number;
}

const buildPeriodParams = (filter?: StatisticsPeriodFilter) => {
  if (!filter) return {};

  if (filter.periodType === "day") {
    return {
      periodType: "day",
      date: filter.date,
    };
  }

  if (filter.periodType === "year") {
    return {
      periodType: "year",
      year: filter.year,
    };
  }

  return {
    periodType: "month",
    month: filter.month,
  };
};

export const statisticsService = {
  // Get course registration statistics for selected period
  getCourseRegistrationStats: async (
    filter?: StatisticsPeriodFilter
  ): Promise<CourseRegistrationStats> => {
    const response = await axiosInstance.get<{ success: boolean; data: CourseRegistrationStats }>(
      "/statistics/course-registrations",
      {
        params: buildPeriodParams(filter),
      }
    );
    return response.data.data as unknown as CourseRegistrationStats;
  },

  // Get revenue statistics by course and selected period
  getRevenueStats: async (
    courseId?: number,
    filter?: StatisticsPeriodFilter
  ): Promise<RevenueStats> => {
    const params = {
      ...(courseId ? { courseId } : {}),
      ...buildPeriodParams(filter),
    };
    const response = await axiosInstance.get<{ success: boolean; data: RevenueStats }>(
      "/statistics/revenue",
      { params }
    );
    return response.data.data as unknown as RevenueStats;
  },

  // Get all courses for filter dropdown
  getCoursesForFilter: async (): Promise<CourseForFilter[]> => {
    const response = await axiosInstance.get<{ success: boolean; data: CourseForFilter[] }>(
      "/statistics/courses"
    );
    return response.data.data as unknown as CourseForFilter[];
  },
};
