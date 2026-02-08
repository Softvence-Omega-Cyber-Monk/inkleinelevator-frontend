import { useGetAboutContentQuery } from "@/Redux/features/AdminDashboard/contentManagement/aboutsection/aboutsectionApi";
import React from "react";
import { ClipLoader } from "react-spinners";
import golmatha from "@/assets/image/golmatha.png";
import btnIcon from "@/assets/image/uu.png";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/Redux/hooks";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";

const ElevatorLandingPage: React.FC = () => {
  const { data, isLoading } = useGetAboutContentQuery({});
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  console.log("iam the about content from home", data);
  const aboutContent = data?.data;
  console.log("iam the about content from home", aboutContent);

  const Loader = () => <ClipLoader size={18} color="#5CE1E6" />;

  const handleGetStarted = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 min-h-screen items-center py-16 sm:py-12 lg:py-0">
          {/* Left Section - Images */}
          <div className="relative flex items-center justify-center lg:justify-start order-2 lg:order-1 mt-16 md:mt-0">
            <img src="/aboutContent.png" alt="" />
          </div>

          {/* Right Section - Content */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            {/* About Label */}
            <div className="flex items-center gap-2 text-[#5CE1E6] text-sm font-medium mb-4 sm:mb-6">
              <img src={golmatha} alt="" />
              <span className="tracking-wide">
                {isLoading ? (
                  <Loader />
                ) : (
                  aboutContent?.sectionLabel || "About Us"
                )}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.15] tracking-tight">
              {isLoading ? (
                <Loader />
              ) : (
                aboutContent?.title || "Elevating the Elevator Industry"
              )}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 sm:mb-8 max-w-[600px]">
              {isLoading ? (
                <Loader />
              ) : (
                (aboutContent?.description ??
                `At In-Klein Elevator, our vision is to transform the way elevator companies grow their business by using the elevator industry's first bidding platform built exclusively for them. We're here to make job bidding faster, easier, and more accessible whether you're a large or a small company looking to expand and get jobs.

                Our software opens the door to real-time opportunities by allowing contractors to post jobs and companies to bid within a 72-hour window, giving everyone a fair shot at winning new jobs.

                We believe elevator companies deserve a smarter way to scale, and In-Klein is the tool to make that happen.`)
              )}
            </p>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="inline-flex items-center cursor-pointer justify-center gap-2 sm:gap-3 bg-[#1a2332] text-white px-4 py-3 sm:py-2 text-sm sm:text-base font-semibold hover:bg-[#2a3544]  w-full sm:w-fit shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 ease-out transform disabled:opacity-70"
            >
              <span>
                {isLoading ? (
                  <Loader />
                ) : (
                  aboutContent?.ctaButtonText || "Get Started as a Requester"
                )}
              </span>
              <img src={btnIcon} className="w-10 h-10 -mr-2" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevatorLandingPage;
