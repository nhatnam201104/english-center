import type { RouteObject } from 'react-router-dom';
import ParentLayout from '../layouts/parent/parent.layout';

const ParentRoutes: RouteObject = {
  path: 'parent',
  element: <ParentLayout />,
  children: [
    {
      index: true,
      element: <div>Admin Dashboard</div>
    },
  ],
};

export default ParentRoutes;
