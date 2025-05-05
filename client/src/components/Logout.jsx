import useAuthStore from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function Logout() {
  const navigate = useNavigate();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);
  return (
    <div className="w-full flex h-96 items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}

export default Logout;
