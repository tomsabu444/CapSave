import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./context/ProtectedRoute";
import CustomToastContainer from "./components/CustomToastContainer";
import Loader from "./components/Loader.jsx";

// Lazy-loaded page components
const LoginRegisterPage = lazy(() =>
  import("./pages/auth/LoginRegisterPage.jsx")
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/auth/ForgotPasswordPage.jsx")
);
// const HomePage = lazy(() => import("./pages/HomePage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const CaptureMediaPage = lazy(() => import("./pages/CaptureMediaPage"));
const MediaGalleryPage = lazy(() => import("./pages/MediaGalleryPage"));

function App() {
  return (
    <Router>
      <CustomToastContainer />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/" element={<AlbumPage />} />
              <Route path="/albums/:albumId" element={<MediaGalleryPage />} />
              <Route path="/capture" element={<CaptureMediaPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
