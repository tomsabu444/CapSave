import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Link, useLocation } from "react-router-dom";
import logo_full_dark from "../assets/images/logo_full_dark.svg";
import logo_full_light from "../assets/images/logo_full_light.svg";
import {
  CameraAlt as CameraAltIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const Sidebar = forwardRef((props, ref) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    closeSidebar: () => setIsSidebarOpen(false),
  }));

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 🔲 Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 📌 Sidebar */}
      <aside
        className={`fixed lg:static flex flex-col h-screen w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* 🔥 Logo */}
        <div className="flex items-center justify-between lg:justify-center py-6 px-4">
          {/* Light Mode Logo */}
          <img src={logo_full_light} alt="Logo Light" className="w-36 object-contain hidden dark:block" />
          {/* Dark Mode Logo */}
          <img src={logo_full_dark} alt="Logo Dark" className="w-36 object-contain dark:hidden" />

          {/* Close Icon (Mobile only) */}
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <CloseIcon className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* 📋 Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem to="/" icon={<PhotoLibraryIcon />} label="Albums" isActive={isActive("/")} />
          <hr className="my-3 border-gray-300 dark:border-gray-600" />
          <SidebarItem to="/capture" icon={<CameraAltIcon />} label="Capture" isActive={isActive("/capture")} />
        </nav>
      </aside>
    </>
  );
});

const SidebarItem = ({ to, icon, label, isActive }) => (
  <Link to={to}>
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white font-semibold"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <span className="text-base">{label}</span>
    </div>
  </Link>
);

export default Sidebar;
