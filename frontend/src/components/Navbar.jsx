import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";

function Navbar({ onHamburgerClick }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileAddMenu, setShowMobileAddMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // dummy theme toggle

  return (
    <div className="relative h-18 bg-white flex items-center px-4  justify-between">
      {/* 🍔 Hamburger (Mobile only) */}
      <button onClick={onHamburgerClick} className="xl:hidden text-blue-600">
        <MenuIcon fontSize="medium" />
      </button>

      {/* 🔍 Search (Desktop) */}
      <div className="hidden xl:flex items-center w-1/3 max-w-sm relative">
        <SearchIcon className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by tags..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 🖥️ Desktop Controls */}
      <div className="hidden xl:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CameraAltIcon />}
          >
            Capture
          </Button>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-blue-600"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        {/* Removed AddIcon here */}
        <Avatar sx={{ width: 32, height: 32 }} />
      </div>

      {/* 📱 Mobile Controls */}
      <div className="flex xl:hidden items-center space-x-3 relative">
        <button onClick={() => setMobileSearchOpen((prev) => !prev)}>
          <SearchIcon className="text-blue-600" />
        </button>

        {/* 🌗 Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-blue-600"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        {/* ➕ Mobile Add Dropdown */}
        <div className="relative">
          <button onClick={() => setShowMobileAddMenu((prev) => !prev)}>
            <AddIcon className="text-blue-600" />
          </button>

          {showMobileAddMenu && (
            <ClickAwayListener onClickAway={() => setShowMobileAddMenu(false)}>
              <div className="absolute top-10 right-0 z-50 bg-white shadow-md rounded-md px-3 py-2 w-40">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                    onClick={() => setShowMobileAddMenu(false)}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<CameraAltIcon />}
                    onClick={() => setShowMobileAddMenu(false)}
                  >
                    Capture
                  </Button>
                </div>
              </div>
            </ClickAwayListener>
          )}
        </div>

        <Avatar sx={{ width: 32, height: 32 }} />
      </div>

      {/* 🔍 Mobile Fullscreen Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-4">
          <SearchIcon className="text-gray-400 mr-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            className="flex-1 py-2 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="ml-2 text-blue-600 font-semibold"
            onClick={() => setMobileSearchOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
