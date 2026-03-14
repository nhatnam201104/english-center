import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

interface RoleBasedRedirectProps {
  allowedRole: string;
  redirectTo: string;
}

export const RoleBasedRedirect = ({ allowedRole, redirectTo }: RoleBasedRedirectProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role !== allowedRole) {
        switch (user.role) {
          case 'ADMIN':
            navigate('/admin', { replace: true });
            break;
          case 'TEACHER':
            navigate('/teacher/courses', { replace: true });
            break;
          case 'PARENT':
            navigate('/parent', { replace: true });
            break;
          case 'STUDENT':
            navigate('/student/dashboard', { replace: true });
            break;
          default:
            navigate(redirectTo, { replace: true });
            break;
        }
      }
    } else if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate, allowedRole, redirectTo]);

  return null;
};
