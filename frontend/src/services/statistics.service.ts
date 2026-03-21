import axiosInstance from "../configs/axios.config";

export interface CourseRegistrationStats {
  totalRegistrations: number;
  month: number;
  year: number;
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

export const statisticsService = {
  // Get course registration statistics for current month
  getCourseRegistrationStats: async (): Promise<CourseRegistrationStats> => {
    const response = await axiosInstance.get<{ success: boolean; data: CourseRegistrationStats }>(
      "/statistics/course-registrations"
    );
    return response.data.data as unknown as CourseRegistrationStats;
  },

  // Get revenue statistics by course
  getRevenueStats: async (courseId?: number): Promise<RevenueStats> => {
    const params = courseId ? { courseId } : {};
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
