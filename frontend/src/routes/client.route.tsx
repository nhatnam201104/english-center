import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import CourseDetail from '../pages/client/courseDetail';
import Home from '../pages/client/home';
import EnrollmentFlowPage from '../pages/client/enrollment.page';
import PaymentResultPage from '../pages/client/payment-result.page';
import AdmissionsPage from '../pages/client/admissions.page';
import TrainingPage from '../pages/client/training.page';
import NewsPage from '../pages/client/news.page';
import ContactPage from '../pages/client/contact.page';


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
      path: "tuyen-sinh",
      element: <AdmissionsPage />,
    },
    {
      path: "dao-tao",
      element: <TrainingPage />,
    },
    {
      path: "tin-tuc",
      element: <NewsPage />,
    },
    {
      path: "lien-he",
      element: <ContactPage />,
    },
    {
      path: "payment/result",
      element: <PaymentResultPage />,
    },
  ],
};

export default ClientRoutes;
