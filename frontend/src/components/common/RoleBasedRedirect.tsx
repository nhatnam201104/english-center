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
        navigate(redirectTo, { replace: true });
      }
    } else if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate, allowedRole, redirectTo]);

  return null;
};