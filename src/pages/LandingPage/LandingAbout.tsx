import { useGetAboutContentQuery } from "@/Redux/features/AdminDashboard/contentManagement/aboutsection/aboutsectionApi";
import React from "react";
import { ClipLoader } from "react-spinners";
import golmatha from "@/assets/image/golmatha.png";
import btnIcon from "@/assets/image/uu.png";

const ElevatorLandingPage: React.FC = () => {
  const { data, isLoading } = useGetAboutContentQuery({});

  const aboutContent = data?.data;

  const Loader = () => <ClipLoader size={18} color="#5CE1E6" />;

  const handleGetStarted = () => {
    console.log("Get Started clicked");
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
                aboutContent?.title || "Welcome to Elevator"
              )}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 sm:mb-8 max-w-[600px]">
              {isLoading ? (
                <Loader />
              ) : (
                aboutContent?.description || "Description"
              )}
            </p>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#1a2332] text-white px-4 py-3 sm:py-2 text-sm sm:text-base font-semibold hover:bg-[#2a3544] transition-all duration-500 ease-out w-full sm:w-fit shadow-sm hover:shadow-xl hover:scale-[1.02] transform disabled:opacity-70"
            >
              <span>
                {isLoading ? (
                  <Loader />
                ) : (
                  aboutContent?.ctaButtonText || "Get Started"
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
