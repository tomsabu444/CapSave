import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { saveUserToDatabase } from "../api/userApi";

// 📩 Login using email & password
export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 🧾 Register using email & password, update display name, save to backend
export const registerWithEmail = async (email, password, displayName) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(userCred.user, { displayName });
  }

  await saveUserToDatabase(); // sync user to backend DB

  return userCred;
};

// 🔐 Google login and backend sync
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  await saveUserToDatabase(); // sync Google user to backend
  return result;
};

// 🔁 Forgot password
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};
