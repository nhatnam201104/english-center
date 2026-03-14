import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main.layout";
import AuthRoutes from "./auth.route";
import ClientRoutes from "./client.route";
import AdminRoutes from "./admin.route";
import ParentRoutes from "./parent.route";
import TeacherRoutes from "./teacher.route";
import ExamPage from "../pages/client/exam.page";
import StudentRoutes from "./student.route";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        children: [
          AuthRoutes,
          ClientRoutes,
          AdminRoutes,
          ParentRoutes,
          TeacherRoutes,
          StudentRoutes,
          // Exam page renders without header/footer
          {
            path: "exam/:accessToken",
            element: <ExamPage />,
          },
        ],
      },
    ],
  }
]);

export default router;
