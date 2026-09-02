import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ThemeProvider from "./UI/ThemeProvider";
import ThemeSettingButton from "./ThemeSettingButton"
import { useSelector } from "react-redux";

const Layout = () => {
  const navigate = useNavigate();
  const { mode, color } = useSelector((state) => state.theme);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar with independent scrolling */}
      <div className={`w-1/6 lg:w-64 h-full overflow-y-auto transition-all duration-300 ${mode === "dark" ? "bg-black" : "bg-white"}`}>
        <Sidebar />
      </div>
  
      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full w-5/6">
        {/* Header (fixed + aligned with content) */}
        <div
          className="fixed top-0 right-0 z-50 w-[calc(100%-5rem)] lg:w-[calc(100%-16rem)] h-16 shadow transition-all duration-300"
        >
          <Header />
        </div>
  
        {/* Main Layout with independent scrolling */}
        <main
          className="flex-1  pt-16 lg:pt-20 p-4 lg:p-6 overflow-y-auto overflow-x-scroll lg:overflow-x-visible"
          style={{
            backgroundColor: mode === "dark" ? "#020817" : "white",
            color: mode === "dark" ? "white" : "black",
          }}
        >
          <Outlet />
          <ThemeSettingButton />
        </main>
      </div>
    </div>
  );
  
};

export default Layout;

