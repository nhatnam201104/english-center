import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/admin/admin.layout';

const AdminRoutes: RouteObject = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <div>Admin Dashboard</div>
    },
  ],
};

export default AdminRoutes;
