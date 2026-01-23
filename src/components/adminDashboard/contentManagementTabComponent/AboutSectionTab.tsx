// import { useGetAboutContentQuery } from "@/Redux/features/AdminDashboard/contentManagement/aboutsection/aboutsectionApi";
// import React from "react";

// export default function AboutSectionTab() {
//   const { data } = useGetAboutContentQuery({});
//   const aboutContent = data?.data;
//   console.log("iam about data", aboutContent);
//   return (
//     <div className="bg-white rounded-lg p-4 md:p-6">
//       <h2 className="text-lg md:text-xl font-semibold mb-2">
//         About Section Content
//       </h2>
//       <p className="text-sm text-gray-600 mb-6">
//         Content to be displayed in the about us section
//       </p>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Section Label
//           </label>
//           <input
//             type="text"
//             placeholder="About Us"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Title
//           </label>
//           <input
//             type="text"
//             placeholder="Enter title"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             placeholder="At G-tex Elevator, our values to contribute..."
//             rows={4}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             CTA Button Text
//           </label>
//           <input
//             type="text"
//             placeholder="See contact us experience"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Statistics Number
//             </label>
//             <input
//               type="text"
//               placeholder="50+"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Statistics Label
//             </label>
//             <input
//               type="text"
//               placeholder="Satisfied clients"
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
  useGetAboutContentQuery,
  useUpdateAboutContentMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/aboutsection/aboutsectionApi";
import React, { useState, useEffect } from "react";

export default function AboutSectionTab() {
  const { data, isLoading } = useGetAboutContentQuery({});
  const [updateAboutContent, { isLoading: isUpdating }] =
    useUpdateAboutContentMutation();

  const aboutContent = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    sectionLabel: "",
    title: "",
    description: "",
    ctaButtonText: "",
    StatisticsNumber: 0,
    StatisticsLable: "",
  });

  // Set default values when data is fetched
  useEffect(() => {
    if (aboutContent) {
      setFormData({
        sectionLabel: aboutContent.sectionLabel || "",
        title: aboutContent.title || "",
        description: aboutContent.description || "",
        ctaButtonText: aboutContent.ctaButtonText || "",
        StatisticsNumber: aboutContent.StatisticsNumber || 0,
        StatisticsLable: aboutContent.StatisticsLable || "",
      });
    }
  }, [aboutContent]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "StatisticsNumber" ? Number(value) : value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      await updateAboutContent(formData).unwrap();
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (aboutContent) {
      setFormData({
        sectionLabel: aboutContent.sectionLabel || "",
        title: aboutContent.title || "",
        description: aboutContent.description || "",
        ctaButtonText: aboutContent.ctaButtonText || "",
        StatisticsNumber: aboutContent.StatisticsNumber || 0,
        StatisticsLable: aboutContent.StatisticsLable || "",
      });
    }
  };

  if (isLoading) {
    return <div className="bg-white rounded-lg p-4 md:p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        About Section Content
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Content to be displayed in the about us section
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            name="sectionLabel"
            value={formData.sectionLabel}
            onChange={handleChange}
            placeholder="About Us"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="At G-tex Elevator, our values to contribute..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Button Text
          </label>
          <input
            type="text"
            name="ctaButtonText"
            value={formData.ctaButtonText}
            onChange={handleChange}
            placeholder="See contact us experience"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statistics Number
            </label>
            <input
              type="number"
              name="StatisticsNumber"
              value={formData.StatisticsNumber}
              onChange={handleChange}
              placeholder="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statistics Label
            </label>
            <input
              type="text"
              name="StatisticsLable"
              value={formData.StatisticsLable}
              onChange={handleChange}
              placeholder="Satisfied clients"
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
