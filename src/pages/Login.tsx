import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/Redux/features/auth/authApi";
import { toast } from "sonner";

import { useAppDispatch } from "@/Redux/hooks";
import { setUser } from "@/Redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

const Login: React.FC = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const user = response.data.user;
      const tokens = response.data.tokens;

      // Dispatch user and access token
      dispatch(
        setUser({
          user: user,
          token: tokens.accessToken,
        }),
      );

      console.log("Login successful:", response);
      // Save in localStorage for refresh
      // localStorage.setItem("accessToken", tokens.accessToken);
      // localStorage.setItem("refreshToken", tokens.refreshToken);

      // Show success toast
      if (response.success) {
        toast.success(response.message || "Login successful!");
        if (user.role === "USER") {
          navigate("/user");
        } else if (user.role === "ELEVATOR") {
          navigate("/elevator");
        } else if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "SUPER_ADMIN") {
          navigate("/admin");
        }
      } else {
        toast.error(response.message || "Login failed!");
      }

      // Save tokens to localStorage if needed
      // localStorage.setItem("accessToken", tokens.accessToken);
      // localStorage.setItem("refreshToken", tokens.refreshToken);

      // Redirect to dashboard
      // navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err?.data?.message || err.message);
      toast.error(err?.data?.message || "Login failed!");
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/LogIn.png"
          alt="Elevator maintenance"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 left-8">
          <div className="bg-white px-4 py-2 rounded">
            <span className="text-gray-900 font-bold text-lg">IN-KLEIN</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-2xl h-[600px] w-full flex items-center justify-center border border-gray-200 shadow-md rounded-2xl">
          <div className="max-w-md w-full ">
            <div className="text-center mb-6 ">
              <h1 className="text-3xl font-bold text-gray-900 pb-5">Log In</h1>
              <p className="text-gray-500 text-sm">
                Sign in to your In-Klein Elevator account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-12"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
                    {...register("rememberMe")}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Forgot Password ?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading} // disable button while loading
              >
                {isLoading ? <BeatLoader size={8} color="#fff" /> : "Log In"}
              </button>

              {/* Registration Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button className="text-gray-900 font-medium hover:underline">
                  Registration
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
