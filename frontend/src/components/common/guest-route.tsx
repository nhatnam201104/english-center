import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // If user is already authenticated, redirect to their dashboard based on role
  if (isAuthenticated && user) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "TEACHER":
        return <Navigate to="/teacher/courses" replace />;
      case "PARENT":
        return <Navigate to="/parent" replace />;
      case "STUDENT":
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default GuestRoute;
