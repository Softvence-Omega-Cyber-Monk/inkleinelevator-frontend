import React from "react";

import { useAppSelector } from "@/Redux/hooks";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  console.log("iam the user from redux", user);
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

  const location = useLocation();

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
    <footer className="relative bg-[#696868] text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/footer.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative max-w-[1500px] mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Left - Main Heading and Buttons */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight mb-8">
              Connecting construction needs
              <br />
              with certified expertise.
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleButtonClick}
                className="bg-[#2dd4bf] text-black px-6 py-3  cursor-pointer rounded font-medium hover:bg-[#2dd4bf]/90  hover:scale-[1.02] transition-all duration-500 ease-out transform"
              >
                Get started
              </button>
              <button
                onClick={handleContactClick}
                className="bg-white text-black px-6 py-3 cursor-pointer rounded font-medium hover:bg-gray-100  hover:scale-[1.02] transition-all duration-500 ease-out transform"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right - Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {/* Address */}
            {/* <div>
              <h3 className="text-sm font-semibold mb-3">Address</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kingstone ---
                <br />
                Deniel street office
                <br />
                Berlin, Germany
              </p>
            </div> */}

            {/* Say Hello */}
            <div>
              {/* <h3 className="text-sm font-semibold mb-3">Say Hello</h3> */}
              <p className="text-gray-400 text-sm mb-1">
                Email: kleinelevator@gmail.com
              </p>
              {/* <p className="text-gray-400 text-sm">+268 368 3168</p> */}

              {/* Social Icons */}
              {/* <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
                >
                  <Youtube size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
                >
                  <Linkedin size={16} />
                </a>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="/how-it-works"
                className="text-gray-400 hover:text-white transition-colors"
              >
                How it works
              </a>

              <a
                href="/success-stories"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Success Stories
              </a>
            </nav>

            {/* Legal Links */}
            <div className="flex gap-6 text-sm">
              <Link
                to="trms-conditions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms and Conditions
              </Link>

              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
