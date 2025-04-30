import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import AlbumPage from "./pages/AlbumPage";
import CaptureMediaPage from "./pages/CaptureMediaPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Landing" element={<LandingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/album" element={<AlbumPage />} />
        <Route path="/capture" element={<CaptureMediaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
