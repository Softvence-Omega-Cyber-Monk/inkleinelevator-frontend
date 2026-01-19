import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import hireImg from "@/assets/image/createdacount.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRegisterMutation } from "@/Redux/features/auth/authApi";
import { toast } from "sonner";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from "react-router-dom";
export default function HireSignupForm() {
  const [register, { isLoading }] = useRegisterMutation();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 states
  const [serviceName, setServiceName] = useState("");
  const [businessLogo, setBusinessLogo] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const navigate = useNavigate();

  //   for make button desabel  is user miss any field
  const isDisabled = () => {
    if (isLoading) return true;

    if (step === 1) {
      return (
        !name.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !password.trim() ||
        !companyName.trim()
      );
    }

    if (step === 2) {
      return !serviceName.trim() || !businessLogo || !licenseFile;
    }

    return true; // default disabled
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", "USER");
    formData.append("companyName", companyName);
    if (businessLogo) formData.append("businessLogo", businessLogo);
    if (licenseFile) formData.append("licenseInfo", licenseFile);

    try {
      const response = await register(formData).unwrap();
      console.log("Registered successfully:", response);

      //  Show success toast
      if (response.success) {
        toast.success(response.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(response.message || "Something went wrong!");
      }
    } catch (err: any) {
      console.error("Register failed:", err);

      //  Show error toast
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4">
        <div className="max-w-2xl h-[700px] w-full flex items-center justify-center border border-gray-200 shadow-md rounded-2xl">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 pt-8">
                Create an account
              </h1>
              <p className="text-gray-500 text-sm">Enter your details</p>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
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

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 text-sm"
                  />
                </div>

                {/* Next */}
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
                >
                  Next
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <span className="text-gray-900 font-medium cursor-pointer">
                    Log In
                  </span>
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Business Information
                </h2>

                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Enter your services Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 text-sm"
                  />
                </div>

                {/* Business Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Business Logo
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) =>
                      setBusinessLogo(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm border py-3 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Please upload JPG, PNG up to 10MB, size less than 100KB
                  </p>
                </div>

                {/* Upload Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Media
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) =>
                      setLicenseFile(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload your license and insurance
                  </p>
                </div>

                {/* Create Account */}
                <button
                  onClick={handleSubmit}
                  className={`w-full py-3 rounded-lg font-medium ${
                    isDisabled() // <-- call it
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  disabled={isDisabled()} // <-- call it here too
                >
                  {isLoading ? (
                    <BeatLoader size={8} color="#ffffff" />
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Back */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full border border-gray-300 py-3 rounded-lg text-sm font-medium"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
