import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/Redux/features/auth/authApi";
import { toast } from "sonner";

export default function ResetPassword() {
  const location = useLocation();
  console.log("location.state 👉", location.state);
  const { email, token } = location.state || {};
  console.log("tokekk", email, token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword({
        password,
        token, // ✅ REQUIRED BY SWAGGER
      }).unwrap();

      toast.success(result?.message || "Password reset successfully!");
      setIsDialogOpen(true);
    } catch (err: any) {
      const msg = err?.data?.message || "Something went wrong";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-normal text-[#151518] text-center mb-2 font-[Lora]">
          Reset Password
        </h1>

        <p className="text-sm text-[#3F3F46] text-center mb-6 font-[Inter]">
          Reset password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-[#151518] font-medium text-sm">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-[#3F3F46]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-[#F5F7FB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[#151518] font-medium text-sm">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-[#3F3F46]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-[#F5F7FB]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg rounded-lg"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* SUCCESS POPUP */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center py-8">
            <p className="text-sm text-gray-600">
              Password for <strong>{email}</strong> has been reset.
            </p>
            <Link
              to="/login"
              className="w-full mt-6 py-2 bg-gray-900 text-white rounded-lg block"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
