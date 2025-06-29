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
import ProtectedRoute from "./utils/ProtectRoute";
import RequireUser from "./utils/requireUser";
import HomeDetails from "./modules/Shared/component/HomeDetails";
import MyFile from "./modules/myFile/page/MyFile";
import RecycleBin from "./modules/recycleBin/page/RecycleBin";
import MyFileDetails from "./modules/myFile/page/MyFileDetails";
import Home from "./modules/Shared/Pages/Shared";

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
        element: <Home />,
      },
      {
        path: "/folder/*",
        element: <HomeDetails />,
      },
      {
        path: "/my-file",
        element: <MyFile />,
      },
      {
        path: "/my-file/*",
        element: <MyFileDetails />,
      },
      {
        path: "/recycle-bin",
        element: <RecycleBin />,
      },
      {
        path: "/setting/profile",
        element: <ProfileSection />,
      },
    ],
  },
]);
