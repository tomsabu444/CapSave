import React from "react";
import { Box, CircularProgress } from "@mui/material";

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <CircularProgress />
    </div>
  );
}

export default Loader;
