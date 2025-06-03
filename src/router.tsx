import { Navigate, createBrowserRouter } from "react-router-dom";
import ForgotPassword from "./auth/pages/ForgotPassword";
import { Login } from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ResetPassword from "./auth/pages/ResetPassword";
import SendOtp from "./auth/pages/SendOtp";
import { AppLayout } from "./components/appLayout/AppLayout";
import ProfileSection from "./components/navBar/ProfileSection";
import NotFound from "./components/notFound/NotFound";
import UnauthorizePage from "./components/notFound/UnauthorizePage";

import Dashboard from "./modules/dashboard/Pages/Dashboard";

import ProtectedRoute from "./utils/ProtectRoute";
import RequireUser from "./utils/requireUser";
import HomeDetails from "./modules/dashboard/component/HomeDetails";
import Home from "./modules/dashboard/component/Home";

export const routers = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  {
    path: "/login",
    element: <ProtectedRoute children={<Login />} />,
  },
  {
    path: "/register",
    element: <ProtectedRoute children={<Register />} />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizePage />,
  },
  {
    path: "/forget-password",
    element: <ProtectedRoute children={<ForgotPassword />} />,
  },
  {
    path: "forget-password/otp",
    element: <ProtectedRoute children={<SendOtp />} />,
  },
  {
    path: "/reset-password",

    element: <ProtectedRoute children={<ResetPassword />} />,
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    // element: <AppLayout />,
    element: <RequireUser children={<AppLayout />} />,
    children: [
      {
        path: "/",
        // element: <RequireUser children={<DashboardDemo />} />,
        element: <Dashboard />,
        children: [
          {
            index: true,
            path: "/",
            element: <Home />,
          },
          {
            path: "/folder/*",
            element: <HomeDetails />,
          },
        ],
      },
      {
        path: "/setting/profile",
        element: <ProfileSection />,
      },
    ],
  },
]);
