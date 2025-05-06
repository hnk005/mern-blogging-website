import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PropsWithChildren } from "react";
import paths from "@/routes/paths";

const ProtectRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user.access_token) {
    return <Navigate to={paths.signIn} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
