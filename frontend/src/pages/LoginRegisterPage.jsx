import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/images/logo_full_dark.svg";

const LoginRegisterPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsRegister(params.get("register") === "true");
  }, [params]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const uppercase = password.match(/[A-Z]/g) || [];
    const lowercase = password.match(/[a-z]/g) || [];
    const numbers = password.match(/[0-9]/g) || [];
    const symbols = password.match(/[^A-Za-z0-9]/g) || [];

    return (
      uppercase.length >= 2 &&
      lowercase.length >= 2 &&
      numbers.length >= 2 &&
      symbols.length >= 2
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!validatePassword(form.password)) {
        alert(
          "Password must contain at least 2 uppercase, 2 lowercase, 2 numbers, and 2 special characters."
        );
        return;
      }
    }

    // TODO: Handle login/register logic here
  };

  const toggleMode = () => {
    navigate(isRegister ? "/login" : "/login?register=true");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 flex flex-col gap-4"
        aria-label={isRegister ? "Register form" : "Login form"}
      >
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Communets Logo" className="h-12" />
        </div>

        <h2 className="text-xl font-semibold text-center">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        {isRegister && (
          <div className="flex gap-4">
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="given-name"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="family-name"
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
          autoComplete="email"
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          required
          fullWidth
          autoComplete={isRegister ? "new-password" : "current-password"}
          error={
            isRegister && form.password && !validatePassword(form.password)
          }
          helperText={
            isRegister && form.password && !validatePassword(form.password)
              ? "Min 2 uppercase, 2 lowercase, 2 numbers, 2 symbols"
              : ""
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
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
            error={
              form.confirmPassword && form.confirmPassword !== form.password
            }
            helperText={
              form.confirmPassword && form.confirmPassword !== form.password
                ? "Passwords do not match"
                : ""
            }
          />
        )}

        {!isRegister && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline focus:outline-none"
              aria-label="Forgot password"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ textTransform: "none", py: 1 }}
          aria-label={isRegister ? "Register" : "Login"}
        >
          {isRegister ? "Register" : "Login"}
        </Button>

        <Divider>or</Divider>

        {/* Google Sign-In Button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 py-2 w-full rounded-md hover:bg-gray-50"
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
          <span className="text-gray-700">Sign in with Google</span>
        </button>

        <Typography variant="body2" className="text-center">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:underline focus:outline-none"
            aria-label={isRegister ? "Switch to login" : "Switch to register"}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </Typography>
      </form>
    </div>
  );
};

export default LoginRegisterPage;
