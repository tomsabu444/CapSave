import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginRegisterPage from "./pages/auth/LoginRegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
// import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import CaptureMediaPage from "./pages/CaptureMediaPage";
import ProtectedRoute from "./context/ProtectedRoute";
import MediaGalleryPage from "./pages/MediaGalleryPage";
import CustomToastContainer from "./components/CustomToastContainer.jsx";

function App() {
  return (
    <Router>
      <CustomToastContainer />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Pages with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<AlbumPage />} />
            <Route path="/albums/:albumId" element={<MediaGalleryPage />} />
            <Route path="/capture" element={<CaptureMediaPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
