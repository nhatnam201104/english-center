import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import Home from '../components/home/home';

const ClientRoutes: RouteObject = {
  element: <ClientLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
  ],
};

export default ClientRoutes;
