import React from 'react';

interface ElevatorLandingPageProps {
  statNumber?: string;
  statLabel?: string;
  aboutLabel?: string;
  mainHeading?: string;
  description?: string;
  buttonText?: string;
  image1Url?: string;
  image2Url?: string;
}

const ElevatorLandingPage: React.FC<ElevatorLandingPageProps> = ({
  statNumber = "2500+",
  statLabel = "Satisfied Users",
  aboutLabel = "About Us",
  mainHeading = "Elevating the Elevator Industry",
  description = "At In-Klein Elevator, our vision is to transform the way elevator companies grow their business by using the elevator industry's first bidding platform built exclusively for them. We're here to make job bidding faster, easier, and more accessible whether you're a large or a small company looking to expand and get for jobs. Our software opens the door to real-time opportunities by allowing contractors to post jobs and companies to bid within a 72-hour window, giving everyone a fair shot at winning new jobs. We believe elevator companies deserve a smarter way to scale and In-Klein is the tool to make that happen.",
  buttonText = "Get Started as a Requester",
  image1Url = "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop",
  image2Url = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"
}) => {
  const handleGetStarted = () => {
    console.log('Get Started clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="min-h-screen max-w-[1500px] mx-auto bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Section - Images */}
        <div className="relative bg-white p-8 lg:p-12 flex items-center justify-center">
          {/* Stat Text - Rotated Vertically on Left */}
          <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left z-10">
            <div className="flex items-center gap-4 bg-white">
              <span className="text-6xl font-bold text-gray-900 leading-none">{statNumber}</span>
              <span className="text-sm text-gray-600 font-light whitespace-nowrap">{statLabel}</span>
            </div>
          </div>

          {/* Mobile Stat */}
          <div className="lg:hidden flex items-center gap-4 absolute top-8 left-8 z-10">
            <span className="text-5xl font-bold text-gray-900">{statNumber}</span>
            <span className="text-sm text-gray-600">{statLabel}</span>
          </div>

          {/* Images Container */}
          <div className="relative w-full max-w-md ml-12">
            {/* Large Image - Main */}
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={image1Url} 
                alt="Elevator technician working" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Small Image - Overlapping Bottom Left */}
            <div className="absolute bottom-8 -left-8 w-48 h-56 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src={image2Url} 
                alt="Elevator interior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-col justify-center px-12 lg:px-16 py-20">
          {/* About Label */}
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-5 tracking-wide">
            <span>←</span>
            <span>{aboutLabel}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {mainHeading}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-10">
            {description}
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleGetStarted}
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-md text-base font-semibold hover:bg-blue-700 transition-colors duration-300 w-fit"
          >
            {buttonText}
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElevatorLandingPage;