import { Request, Response } from "express";
import { 
  getCourseRegistrationStatsService, 
  getRevenueStatsService, 
  getAllCoursesForFilterService,
  getAdmissionStudentsService 
} from "../services/statistics.service";

export class StatisticsController {
  // GET /api/statistics/course-registrations
  getCourseRegistrationStats = async (req: Request, res: Response) => {
    try {
      const stats = await getCourseRegistrationStatsService();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting course registration stats:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê đăng ký khóa học",
      });
    }
  };

  // GET /api/statistics/revenue
  // Query params: courseId (optional)
  getRevenueStats = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.query;
      const courseIdNum = courseId ? parseInt(courseId as string) : undefined;
      
      const stats = await getRevenueStatsService(courseIdNum);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting revenue stats:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê doanh thu",
      });
    }
  };

  // GET /api/statistics/courses
  getAllCoursesForFilter = async (req: Request, res: Response) => {
    try {
      const courses = await getAllCoursesForFilterService();
      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      console.error("Error getting courses for filter:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách khóa học",
      });
    }
  };

  // GET /api/statistics/admission-students
  // Query params: page, limit, search
  getAdmissionStudents = async (req: Request, res: Response) => {
    try {
      const { page, limit, search } = req.query;
      
      const data = await getAdmissionStudentsService({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        search: search as string || "",
      });
      
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error getting admission students:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách học sinh tuyển sinh",
      });
    }
  };
}

export default new StatisticsController();
