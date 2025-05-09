let apiBase = import.meta.env.VITE_API_BASE_URL;

if (!apiBase) {
  if (import.meta.env.MODE === "development") {
    console.warn(
      "[API CONFIG] ⚠️ VITE_API_BASE_URL not found in .env. Falling back to http://localhost:5000/api"
    );
  }

  apiBase = "http://localhost:5000/api";
}

export const API_BASE_URL = apiBase;
