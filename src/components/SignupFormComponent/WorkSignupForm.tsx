import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import hireImg from "@/assets/image/login.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRegisterMutation } from "@/Redux/features/auth/authApi";
import { toast } from "sonner";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from "react-router-dom";

export default function WorkSignupForm() {
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload

    // simple validation
    if (!name || !email || !phone || !password) {
      toast.error("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", "USER");

    try {
      const response = await register(formData).unwrap();
      console.log("Registered successfully:", response);

      if (response.success) {
        toast.success(response.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(response.message || "Something went wrong!");
      }
    } catch (err: any) {
      console.error("Register failed:", err);
      const errorMsg =
        err?.data?.message || err?.error || "Registration failed!";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-500">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={hireImg}
          alt="Elevator maintenance"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 left-8">
          <div
            onClick={() => (window.location.href = "/")}
            className="bg-white px-4 py-2 rounded cursor-pointer"
          >
            <span className="text-gray-900 font-bold text-lg">IN-KLEIN</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-2xl h-[700px] w-full flex items-center justify-center border border-gray-200 shadow-md rounded-2xl">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 pt-2">
                Create an account
              </h1>
              <p className="text-gray-500 text-sm">Enter your details</p>
            </div>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mobile Number
                </label>
                <PhoneInput
                  country={"bd"}
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: "100%",
                    height: "3rem",
                    fontSize: "0.875rem",
                    paddingLeft: "4rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #D1D5DB",
                  }}
                  buttonStyle={{
                    borderRadius: "0.5rem 0 0 0.5rem",
                    border: "1px solid #D1D5DB",
                    borderRight: "0",
                    height: "3rem",
                  }}
                  specialLabel=""
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-1 focus:ring-gray-900 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <BeatLoader size={8} color="#fff" />
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span className="text-gray-900 font-medium cursor-pointer">
                  Log In
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
