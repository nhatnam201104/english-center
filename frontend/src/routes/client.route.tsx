import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import CourseDetail from '../pages/client/courseDetail';
import Home from '../pages/client/home';


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
  ],
};

export default ClientRoutes;
