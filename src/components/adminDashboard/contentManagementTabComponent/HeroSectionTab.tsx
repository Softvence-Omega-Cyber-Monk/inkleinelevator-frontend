// import { useGetHeroContentQuery } from "@/Redux/features/AdminDashboard/contentManagement/contentManagementApi";
// import React from "react";

// export default function HeroSectionTab() {
//   const { data } = useGetHeroContentQuery({});
//   const heroContent = data?.data;
//   console.log("iam hero content ", heroContent);
//   return (
//     <div className="bg-white rounded-lg p-4 md:p-6">
//       <h2 className="text-lg md:text-xl font-semibold mb-2">
//         Hero Section Content
//       </h2>
//       <p className="text-sm text-gray-600 mb-6">
//         Main landing page content (editable now)
//       </p>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Tagline
//           </label>
//           <input
//             type="text"
//             placeholder="Enter tagline (optional)"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Main Title
//           </label>
//           <textarea
//             placeholder="This section showcases the hero, essential top-tier elevator solutions, fusing quality with expertise to serve you. At gcore, We take pride in high-rise commercial buildings and complex elevator projects."
//             rows={4}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Subtitle
//           </label>
//           <input
//             type="text"
//             placeholder="Enter a subtitle"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Primary CTA Button
//             </label>
//             <input
//               type="text"
//               placeholder="Request Projects #1"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Secondary CTA Button
//             </label>
//             <input
//               type="text"
//               placeholder="Secondary Button"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mt-6">
//         <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
//           Save Changes
//         </button>
//         <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//           Reset to Default
//         </button>
//       </div>
//     </div>
//   );
// }

import {
  useGetHeroContentQuery,
  useUpdateHeroContentMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/contentManagementApi";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function HeroSectionTab() {
  const { data, isLoading } = useGetHeroContentQuery({});
  const [updateHeroContent, { isLoading: isUpdating }] =
    useUpdateHeroContentMutation();

  const heroContent = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    tagline: "",
    mainTitle: "",
    subtitle: "",
    primaryCTA: "",
    secondaryCTA: "",
  });

  // Set default values when data is fetched
  useEffect(() => {
    if (heroContent) {
      setFormData({
        tagline: heroContent.tagline || "",
        mainTitle: heroContent.mainTitle || "",
        subtitle: heroContent.subtitle || "",
        primaryCTA: heroContent.primaryCTA || "",
        secondaryCTA: heroContent.secondaryCTA || "",
      });
    }
  }, [heroContent]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      const result = await updateHeroContent(formData).unwrap();

      // backend-based toast
      if (result?.success) {
        toast.success(result?.message || "Updated successfully");
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Failed to save changes:", error);

      toast.error(
        error?.data?.message || "Failed to save changes. Please try again.",
      );
    }
  };

  // Handle reset
  const handleReset = async () => {
    const emptyData = {
      tagline: "",
      mainTitle: "",
      subtitle: "",
      primaryCTA: "",
      secondaryCTA: "",
    };

    try {
      // UI reset
      setFormData(emptyData);

      // API call with empty values
      const result = await updateHeroContent(emptyData).unwrap();

      if (result?.success) {
        toast.success(result?.message || "Reset successfully");
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Reset failed:", error);

      toast.error(error?.data?.message || "Failed to reset. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="bg-white rounded-lg p-4 md:p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        Hero Section Content
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Main landing page content (editable now)
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Enter tagline (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Title
          </label>
          <textarea
            name="mainTitle"
            value={formData.mainTitle}
            onChange={handleChange}
            placeholder="This section showcases the hero, essential top-tier elevator solutions..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Enter a subtitle"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary CTA Button
            </label>
            <input
              type="text"
              name="primaryCTA"
              value={formData.primaryCTA}
              onChange={handleChange}
              placeholder="Request Projects #1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary CTA Button
            </label>
            <input
              type="text"
              name="secondaryCTA"
              value={formData.secondaryCTA}
              onChange={handleChange}
              placeholder="Secondary Button"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleReset}
          disabled={isUpdating}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
