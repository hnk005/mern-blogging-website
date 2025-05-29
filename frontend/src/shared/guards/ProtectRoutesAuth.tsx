import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import paths from "@/routes/paths";

const ProtectRoutesAuth = () => {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (isAuth()) {
    return <Navigate to={paths.home} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectRoutesAuth;
