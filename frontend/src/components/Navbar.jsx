import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import MediaUploadModal from "./MediaUploadModal";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onHamburgerClick }) {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { darkMode, setDarkMode } = useTheme();

  const [showMobileAddMenu, setShowMobileAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Sign-out handler: invoked on click or touch
  const handleSignOut = async (e) => {
    e.stopPropagation();
    setShowProfileMenu(false);
    await signOut(auth);
    navigate("/login");
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setShowProfileMenu((prev) => !prev);
  };

  const renderProfileMenu = () => (
    <ClickAwayListener onClickAway={() => setShowProfileMenu(false)}>
      <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 shadow-md rounded-md z-50 p-4 space-y-2">
        <div className="text-left text-sm text-gray-800 dark:text-white font-semibold">
          {user?.displayName || "No Name"}
        </div>
        <div className="text-left text-sm text-gray-500 dark:text-gray-300 truncate">
          {user?.email || "No Email"}
        </div>
        <div className="border-t my-2 border-gray-300 dark:border-gray-600" />
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleSignOut}
          onTouchStart={handleSignOut} // ensure touch triggers sign-out
        >
          Sign Out
        </Button>
      </div>
    </ClickAwayListener>
  );

  return (
    <div className="relative h-18 bg-white dark:bg-gray-900 flex items-center px-4 justify-between">
      {/* 🍔 Hamburger (Mobile only) */}
      <button onClick={onHamburgerClick} className="lg:hidden text-blue-600">
        <MenuIcon fontSize="medium" />
      </button>

      {/* 🖥️ Desktop Controls */}
      <div className="hidden lg:flex w-full justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={() => setUploadOpen(true)}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CameraAltIcon />}
            onClick={() => navigate("/capture")}
          >
            Capture
          </Button>
        </div>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="text-blue-600 cursor-pointer"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="cursor-pointer shadow-lg border-2 border-blue-600 rounded-full"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.displayName?.charAt(0) || "?"}
            </Avatar>
          </button>
          {showProfileMenu && renderProfileMenu()}
        </div>
      </div>

      {/* 📱 Mobile Controls */}
      <div className="flex lg:hidden items-center space-x-3 relative">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="text-blue-600 cursor-pointer"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        <div className="relative">
          <button onClick={() => setShowMobileAddMenu((prev) => !prev)}>
            <AddIcon className="text-blue-600 cursor-pointer" />
          </button>

          {showMobileAddMenu && (
            <ClickAwayListener onClickAway={() => setShowMobileAddMenu(false)}>
              <div className="absolute top-10 right-0 z-50 bg-white dark:bg-gray-800 shadow-md rounded-md px-3 py-2 w-40">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                    onClick={() => {
                      setUploadOpen(true);
                      setShowMobileAddMenu(false);
                    }}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<CameraAltIcon />}
                    onClick={() => {
                      navigate("/capture");
                      setShowMobileAddMenu(false);
                    }}
                  >
                    Capture
                  </Button>
                </div>
              </div>
            </ClickAwayListener>
          )}
        </div>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="cursor-pointer shadow-lg border-2 border-blue-600 rounded-full"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.displayName?.charAt(0) || "?"}
            </Avatar>
          </button>
          {showProfileMenu && renderProfileMenu()}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && <MediaUploadModal onClose={() => setUploadOpen(false)} />}   
    </div>
  );
}
