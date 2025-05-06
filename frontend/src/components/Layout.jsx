import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const sidebarRef = useRef(); // Create a ref to access the Sidebar component
  return (
    
    <div className="flex h-screen ">
      <Sidebar ref={sidebarRef} />
      <div className="flex flex-col flex-1">
        <Navbar onHamburgerClick={() => sidebarRef.current.toggleSidebar()}/>   {/* Pass the toggle function to Navbar */}
        {/* main content */}
        <main className="flex-1 md:m-3 md:mr-0 bg-gray-200 md:rounded-l-2xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
