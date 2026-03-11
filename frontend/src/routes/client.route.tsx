import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import CourseDetail from '../pages/client/courseDetail';
import Home from '../pages/client/home';
import EnrollmentFlowPage from '../pages/client/enrollment.page';
import PaymentResultPage from '../pages/client/payment-result.page';


const ClientRoutes: RouteObject = {
  element: <ClientLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "course/:id",
      element: <CourseDetail />,
    },
    {
      path: "dang-ky-khoa-hoc",
      element: <EnrollmentFlowPage />,
    },
    {
      path: "payment/result",
      element: <PaymentResultPage />,
    },
  ],
};

export default ClientRoutes;
