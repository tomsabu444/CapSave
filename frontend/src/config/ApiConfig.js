const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default {
  API_BASE_URL,
  USERS_API: `${API_BASE_URL}/api/v1/users`,
  MEDIA_API: `${API_BASE_URL}/api/v1/media`,
};
