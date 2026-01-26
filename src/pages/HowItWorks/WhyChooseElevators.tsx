import React from "react";
import { useGetHowItsForSectionQuery } from "@/Redux/features/AdminDashboard/contentManagement/howitsfor/howitsforApi";

const WhyChooseElevators: React.FC = () => {
  const { data, isLoading } = useGetHowItsForSectionQuery();

  const sectionData = data?.data;
  const audiences = sectionData?.audiences || [];

  // Create features array from ALL audiences (not just one of each type)
  const features = audiences
    .filter((audience) => {
      // Only include cards that have at least one field filled
      return audience.cardTitle || audience.cardSubtitle || audience.bulletText;
    })
    .map((audience) => ({
      title: audience.cardTitle || "",
      subtitle: audience.cardSubtitle || "",
      bulletText: audience.bulletText || "",
    }));

  if (isLoading) {
    return (
      <div className="bg-[#0a1628] flex items-center justify-center px-[40px] py-[120px]">
        <div className="max-w-[1300px] w-full bg-white rounded-3xl px-8 py-[80px]">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a1628] flex items-center justify-center px-[40px] py-[120px]">
      <div className="max-w-[1300px] w-full bg-white rounded-3xl px-8 py-[80px]">
        {/* Header */}
        <div className="text-center mb-12">
          {sectionData?.label && (
            <p className="text-gray-500 text-sm mb-2">{sectionData.label}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {sectionData?.title || "Why Choose In-Klein Elevators?"}
          </h1>
          {sectionData?.subtitle && (
            <p className="text-gray-600 text-sm">{sectionData.subtitle}</p>
          )}
        </div>

        {/* Features Grid */}
        {features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center shadow p-4 rounded-2xl">
                {/* <div className="bg-gray-900 w-12 h-12 mx-auto flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div> */}
                {/* Title */}
                {feature.title && (
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                )}

                {/* Subtitle */}
                {feature.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {feature.subtitle}
                  </p>
                )}

                {/* Bullet Text */}
                {feature.bulletText && (
                  <div
                    className="text-sm text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: feature.bulletText }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No content available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhyChooseElevators;
