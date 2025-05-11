// src/components/EmailVerificationNotice.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import { auth } from "../../config/firebase";
import { resendVerificationEmail } from "../../services/authService";
import { toast } from "react-toastify";

const EmailVerificationNotice = ({ email, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail(auth.currentUser);
      toast.success("Verification email resent.");
    } catch (err) {
      toast.error("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        toast.success("Email verified!");
        onSuccess?.(); // Call back to AuthFormHandler to reinitiate login
      } else {
        toast.info("Email still not verified.");
      }
    } catch (err) {
      toast.error("Failed to refresh user status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-gray-700">
        A verification link has been sent to <b>{email}</b>.
      </p>
      <p className="text-sm text-gray-600">
        Please verify your email and click refresh below.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="outlined" onClick={handleResend} disabled={loading}>
          Resend Email
        </Button>
        <Button variant="contained" onClick={handleRefresh} disabled={loading}>
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
