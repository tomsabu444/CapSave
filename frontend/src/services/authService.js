import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
  } from "firebase/auth";
  import { auth, provider } from "../config/firebase";
  
  // 📩 Login using email & password
  export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  // 🧾 Register using email & password
  export const registerWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };
  
  // 🔐 Sign in with Google popup
  export const signInWithGoogle = async () => {
    return await signInWithPopup(auth, provider);
  };
  