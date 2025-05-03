import { auth } from "../config/firebase";

// 🔐 Gets current user's Firebase ID token
export const getFirebaseToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found.");
  return await user.getIdToken();
};
