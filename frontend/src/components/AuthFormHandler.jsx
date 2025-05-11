import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  loginWithEmail,
  registerWithEmail,
  signInWithGoogle,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";
import EmailVerificationNotice from "./EmailVerificationNotice";

const AuthFormHandler = ({ isRegister, from }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    password: [],
    confirmPassword: "",
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const errors = [];
      if (value.length < 6) errors.push("• Minimum 6 characters");
      if (!/[A-Z]/.test(value)) errors.push("• At least one uppercase letter");
      if (!/[0-9]/.test(value)) errors.push("• At least one number");
      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value))
        errors.push("• At least one special character");

      setFormErrors((prev) => ({ ...prev, password: errors }));

      if (form.confirmPassword && value !== form.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== form.password) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formErrors.password.length > 0 || formErrors.confirmPassword) {
      toast.error("Fix validation errors before submitting.");
      return;
    }

    try {
      if (isRegister) {
        const fullName = `${form.firstName} ${form.lastName}`;
        const userCred = await registerWithEmail(
          form.email,
          form.password,
          fullName
        );

        setPendingEmail(userCred.user.email);
        setPendingVerification(true);
      } else {
        const userCred = await loginWithEmail(form.email, form.password);

        if (!userCred.user.emailVerified) {
          setPendingEmail(userCred.user.email);
          setPendingVerification(true);
          return;
        }

        toast.success("Logged in successfully");
        const target = from === "/login" ? "/" : from;
        navigate(target, { replace: true });
      }
    } catch (err) {
      if (
        err.message === "Please verify your email before logging in." &&
        auth.currentUser
      ) {
        setPendingEmail(auth.currentUser.email);
        setPendingVerification(true);
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      toast.success("Google login successful");
      const target = from === "/login" ? "/" : from;
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (pendingVerification) {
    return (
      <EmailVerificationNotice
        email={pendingEmail}
        onSuccess={() => {
          const target = from === "/login" ? "/" : from;
          navigate(target, { replace: true });
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isRegister && (
        <div className="flex gap-4">
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        required
        fullWidth
        error={formErrors.password.length > 0}
        helperText={
          formErrors.password.length > 0 && (
            <ul className="pl-4 list-disc text-xs text-red-600">
              {formErrors.password.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isRegister && (
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
        />
      )}

      {!isRegister && (
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline focus:outline-none"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      )}

      <Button type="submit" variant="contained" fullWidth>
        {isRegister ? "Register" : "Login"}
      </Button>

      <Divider>or</Divider>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border border-gray-300 py-3 w-full rounded-md hover:bg-gray-50"
        aria-label="Sign in with Google"
      >
        <svg width="20" viewBox="0 0 512 512">
          <path
            fill="#FBBB00"
            d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
              c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644
              c-5.317,15.501-8.215,32.141-8.215,49.456
              C103.821,274.792,107.225,292.797,113.47,309.408z"
          />
          <path
            fill="#518EF8"
            d="M507.527,208.176C510.467,223.662,512,239.655,512,256
              c0,18.328-1.927,36.206-5.598,53.451
              c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727
              l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
          />
          <path
            fill="#28B446"
            d="M416.253,455.624l0.014,0.014
              C372.396,490.901,316.666,512,256,512
              c-97.491,0-182.252-54.491-225.491-134.681
              l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
              c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
          />
          <path
            fill="#F14336"
            d="M419.404,58.936l-82.933,67.896
              c-23.335-14.586-50.919-23.012-80.471-23.012
              c-66.729,0-123.429,42.957-143.965,102.724
              l-83.397-68.276h-0.014
              C71.23,56.123,157.06,0,256,0
              C318.115,0,375.068,22.126,419.404,58.936z"
          />
        </svg>
        <span className="text-md text-gray-700">Sign in with Google</span>
      </button>
    </form>
  );
};

export default AuthFormHandler;
