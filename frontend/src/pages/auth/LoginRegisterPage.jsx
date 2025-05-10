import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import AuthFormHandler from "../../components/AuthFormHandler";
import logo from "../../assets/images/logo_full_dark.svg";

const LoginRegisterPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    setIsRegister(params.get("register") === "true");
  }, [params]);

  const toggleMode = () => {
    navigate(isRegister ? "/login" : "/login?register=true");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Communets Logo" className="h-12" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>
        <AuthFormHandler isRegister={isRegister} from={from} />
        {/*//! handles the form submission and validation */}
        <Typography variant="body2" className="text-center mt-4">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </Typography>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
