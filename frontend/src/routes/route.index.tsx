import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main.layout";
import AuthRoutes from "./auth.route";
import ClientRoutes from "./client.route";
import AdminRoutes from "./admin.route";
import ParentRoutes from "./parent.route";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        children: [AuthRoutes, ClientRoutes, AdminRoutes, ParentRoutes],
      },
    ],
  }
]);

export default router;
