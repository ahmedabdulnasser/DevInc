import useAuthStore from "@/store/useAuthStore";
import React from "react";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return <>{!isLoggedIn ? <Navigate to="/login" /> : <Outlet />}</>;
}

export default ProtectedRoute;
