// import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { useForgotPasswordMutation } from "@/Redux/features/auth/authApi";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      toast.success(response?.message || "Reset link sent successfully!");
      // 👇 Redirect to OTP page with email
      navigate("/otp-verify", { state: { email } });
      // setIsDialogOpen(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reset link.");
    }
  };

  // Disable scroll for this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-normal text-[#151518] text-center font-[Lora] mb-2">
          Forgot Password?
        </h1>
        <p className="text-sm text-[#3F3F46] text-center mb-6 font-[Inter]">
          Enter your email and we'll send you OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-[#151518] font-medium text-sm"
            >
              Email Address <span className="text-[#151518]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 h-5 w-5 text-[#3F3F46]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full text-black pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2A779E] text-base"
              />
            </div>
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gray-900 cursor-pointer hover:bg-gray-800 text-white font-semibold text-lg rounded-lg transition-all"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full flex flex-col items-center text-center py-8">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>
            <p className="text-sm text-gray-600">
              We have sent a reset link to <strong>{email}</strong>. Please
              check your inbox.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
