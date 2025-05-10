import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const sidebarRef = useRef(); // Create a ref to access the Sidebar component

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar ref={sidebarRef} />
      <div className="flex flex-col flex-1">
        <Navbar onHamburgerClick={() => sidebarRef.current.toggleSidebar()} />
        {/* main content */}
        <main className="flex-1 md:m-3 md:mr-0 bg-gray-200 dark:bg-gray-950 md:rounded-l-2xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
