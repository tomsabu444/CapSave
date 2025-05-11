import { useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import { resetPassword } from "../../services/authService";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      toast.success("Password reset email sent.");
      setEmail("");
    } catch (err) {
      toast.error(`${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 h-1/2 w-full p-4">
        <div className="h-full w-full rounded-lg overflow-hidden">
          <img
            src="https://www.material-tailwind.com/img/bg-reset.avif"
            alt="Reset background"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Card */}
      <div className="relative z-20 w-11/12 max-w-lg px-5">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-poppins">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 font-poppins">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 flex justify-center items-center gap-2 text-white text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <LockIcon className="w-5 h-5" />
              {isSubmitting ? "Sending..." : "Reset"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          © 2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
