import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import CaptureMediaPage from "./pages/CaptureMediaPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        {/* Pages with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="album" element={<AlbumPage />} />
          <Route path="capture" element={<CaptureMediaPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
