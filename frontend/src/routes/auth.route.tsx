import type { RouteObject } from 'react-router-dom';
import ClientLayout from '../layouts/client/client.layout';
import LoginForm from '../components/auth/login/login.form';

const AuthRoutes: RouteObject = {
  path: 'auth',
  element: <ClientLayout />,
  children: [
    {
      path: 'login',
      element: <LoginForm />,
    },
  ],
};

export default AuthRoutes;
