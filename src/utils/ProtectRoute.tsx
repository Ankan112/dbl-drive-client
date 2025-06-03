import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import useAccessToken from "./useAccessToken";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const accessToken = useAccessToken();

  return !accessToken ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
