import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authState } = useAuthContext();

  if (authState.loading) {
    return <Loader fullScreen message="Verificando autenticación..." />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

