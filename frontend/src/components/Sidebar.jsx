import React from "react";
import logo_full_dark from "../assets/images/logo_full_dark.svg";

function Sidebar() {
  return (
    <aside className="w-64 bg-white">
      <div className="flex flex-col items-center justify-center">
        <img src={logo_full_dark} alt="logo_full_dark" />

        <h1 className="text-2xl font-bold text-gray-800 mt-4">My App</h1>
      </div>
    </aside>
  );
}

export default Sidebar;
