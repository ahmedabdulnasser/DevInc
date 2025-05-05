import React from "react";
import Navbar from "./Navbar";
import useAuthStore from "@/store/useAuthStore";

function AppLayout({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && <Navbar />}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

export default AppLayout;
