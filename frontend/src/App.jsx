import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginRegisterPage from "./auth/LoginRegisterPage";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import CaptureMediaPage from "./pages/CaptureMediaPage";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        {/* Pages with layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/capture" element={<CaptureMediaPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
