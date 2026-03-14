import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

type Role = "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role as Role)) {
    // Redirect to their appropriate page based on role
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
        return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
