import type { RouteObject } from "react-router-dom";
import TeacherLayout from "../layouts/teacher/teacher.layout";
import TeacherCourses from "../components/teacher/courses/teacher.courses";
import TeacherCourseDetail from "../components/teacher/course-detail/teacher.course-detail";
import TeacherAvailability from "../components/teacher/availability/teacher.availability";
import ClassAttendance from "../pages/teacher/ClassAttendance";

const TeacherRoutes: RouteObject = {
  path: "teacher",
  element: <TeacherLayout />,
  children: [
    {
      index: true,
      element: <TeacherCourses />,
    },
    {
      path: "courses",
      element: <TeacherCourses />,
    },
    {
      path: "courses/:scheduleId",
      element: <TeacherCourseDetail />,
    },
    {
      path: "availability",
      element: <TeacherAvailability />,
    },
    {
      path: "attendance/:sessionId",
      element: <ClassAttendance />,
    },
  ],
};

export default TeacherRoutes;