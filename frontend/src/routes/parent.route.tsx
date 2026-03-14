import type { RouteObject } from 'react-router-dom';
import ParentLayout from '../layouts/parent/parent.layout';
import ProtectedRoute from '../components/common/protected-route';

const ParentRoutes: RouteObject = {
  path: 'parent',
  element: (
    <ProtectedRoute allowedRoles={["PARENT"]}>
      <ParentLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <div>Parent Dashboard</div>
    },
  ],
};

export default ParentRoutes;
