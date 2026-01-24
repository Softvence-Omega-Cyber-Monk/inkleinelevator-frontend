import { useVerifyOtpMutation } from "@/Redux/features/auth/authApi";
import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OtpVerify() {
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // 4-digit OTP
  const [otp, setOtp] = useState(["", "", "", ""]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (value: any, index: any) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length < 4) {
      toast.error("Please enter the OTP.");
      return;
    }
    console.log("hey i am otp");
    try {
      const res = await verifyOtp({
        email,
        code: otpValue,
      }).unwrap();

      toast.success(res?.message || "OTP Verified!");

      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-normal text-[#151518] text-center font-[Lora] mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-[#3F3F46] text-center mb-6 font-[Inter]">
          Enter the 4-digit code we sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[#151518] font-medium text-sm mb-3">
              One-Time OTP <span className="text-[#151518]">*</span>
            </label>

            <div className="flex items-center justify-between gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-black border border-slate-200 rounded-xl bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2A779E] text-lg font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gray-900 cursor-pointer hover:bg-gray-800 text-white font-semibold text-lg rounded-lg transition-all"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
