import { getFirebaseToken } from "../utils/firebaseToken";
import { API_BASE_URL } from "../config/apiconfig";

/**
 * Sends authenticated user data to the backend to be saved in MongoDB.
 */
export const saveUserToDatabase = async () => {
  const token = await getFirebaseToken();

  const response = await fetch(`${API_BASE_URL}/v1/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Failed to save user to backend.");
  }

  return await response.json();
};
