import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import LoginForm from '../components/auth/login/login.form';
import GuestRoute from '../components/common/guest-route';

const AuthRoutes: RouteObject = {
  path: 'auth',
  element: <ClientLayout />,
  children: [
    {
      path: 'login',
      element: (
        <GuestRoute>
          <LoginForm />
        </GuestRoute>
      ),
    },
  ],
};

export default AuthRoutes;
