import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";

const ReadyGetStarted: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (!user) {
      // User not logged in → go to login page
      navigate("/login");
      return;
    }

    // Navigate based on role
    switch (user.role) {
      case "USER":
        navigate("/user/my-jobs");
        break;
      case "ELEVATOR":
        navigate("/elevator/browse-jobs");
        break;
      case "ADMIN":
      case "SUPER_ADMIN":
        navigate("/admin");
        break;
      default:
        navigate("/login"); // fallback
    }
  };

  const handleContactClick = () => {
    if (location.pathname === "/") {
      // Already on home → just scroll
      const section = document.getElementById("contact-us");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Not on home → navigate and scroll after page loads
      navigate("/", { state: { scrollTo: "contact-us" } });
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-[150px]">
      <div className="max-w-[1500px] w-full bg-[#0a1628] rounded-2xl px-12 py-10 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-white mb-3">
          Ready to Get Started?
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-8">
          Join thousands of building owners and elevator professionals using
          In-Klein Elevators.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleButtonClick}
            className="px-6 py-2.5 bg-white cursor-pointer text-gray-900 rounded font-medium text-sm hover:bg-gray-300  hover:scale-[1.02] transition-all duration-500 ease-out transform"
          >
            Create Free Account
          </button>
          <button
            onClick={handleContactClick}
            className="px-6 py-2.5 bg-transparent cursor-pointer text-white border border-white rounded font-medium text-sm hover:bg-white hover:text-gray-900  hover:scale-[1.02] transition-all duration-500 ease-out transform"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadyGetStarted;
