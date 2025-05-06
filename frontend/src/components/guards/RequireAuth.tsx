// src/components/guards/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PropsWithChildren } from "react";
import paths from "@/routes/paths";

const RequireAuth = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user.access_token) {
    return <Navigate to={paths.signin} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
