// import { Button } from "@/components/ui/button";
// import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
// import { useAppSelector } from "@/Redux/hooks";
// import { ImageIcon } from "lucide-react";
// import { useEffect, useState } from "react";

// interface UserSettingProfileTabProps {
//   isLoading: boolean;
// }

// const UserSettingProfileTab: React.FC<UserSettingProfileTabProps> = ({
//   isLoading,
// }) => {
//   const user = useAppSelector(selectCurrentUser);

//   // =======================
//   // Local state for form
//   // =======================
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   // =======================
//   // Set default values
//   // =======================
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//     }
//   }, [user]);

//   // =======================
//   // Handle input change
//   // =======================
//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // =======================
//   // Save profile (API later)
//   // =======================
//   const handleSaveProfile = () => {
//     console.log("Updated profile data:", formData);
//     // later:
//     // updateProfileMutation(formData)
//     // dispatch(setUser({ user: updatedUser, token }))
//   };

//   // =======================
//   // Image upload
//   // =======================
//   const [image, setImage] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <>
//       {/* ================= Profile Picture ================= */}
//       <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
//         <h2 className="text-lg font-semibold text-gray-900 mb-6">
//           Profile Picture
//         </h2>

//         <div className="flex flex-col items-center">
//           <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50">
//             <div className="mb-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
//                 <ImageIcon className="w-8 h-8 text-gray-400" />
//               </div>
//             </div>

//             <p className="text-sm text-gray-900 font-medium mb-1">
//               Upload Profile image
//             </p>

//             <p className="text-xs text-gray-500 mb-1">
//               Image format - jpg png jpeg
//             </p>

//             <p className="text-xs text-gray-500">
//               Image Size - maximum size 2 MB Image Ratio - 1:1
//             </p>

//             <input
//               type="file"
//               accept="image/jpg,image/png,image/jpeg"
//               onChange={handleImageChange}
//               className="hidden"
//               id="profile-upload"
//             />
//           </div>

//           <label
//             htmlFor="profile-upload"
//             className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
//           >
//             Upload Profile
//           </label>
//         </div>
//       </div>

//       {/* ================= Profile Information ================= */}
//       <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
//         <h2 className="text-lg font-semibold text-gray-900 mb-6">
//           Profile Information
//         </h2>

//         <div className="space-y-6">
//           {/* Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={formData.name}
//               onChange={(e) => handleInputChange("name", e.target.value)}
//               className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange("email", e.target.value)}
//               className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label
//               htmlFor="phone"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Phone Number
//             </label>
//             <input
//               id="phone"
//               type="tel"
//               value={formData.phone}
//               onChange={(e) => handleInputChange("phone", e.target.value)}
//               className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//             />
//           </div>

//           {/* Save Button */}
//           <div className="pt-4">
//             <Button
//               onClick={handleSaveProfile}
//               disabled={isLoading}
//               className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserSettingProfileTab;

import { Button } from "@/components/ui/button";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import {
  useUpdateUserProfileMutation,
  useUserUploadProfileImageMutation,
} from "@/Redux/features/userDa/userProfileUpdated/userProfileUpdatedApi";
import { useAppSelector } from "@/Redux/hooks";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserSettingProfileTabProps {
  isLoading: boolean;
}

const UserSettingProfileTab: React.FC<UserSettingProfileTabProps> = ({}) => {
  const user = useAppSelector(selectCurrentUser);
  console.log("ianm the use ", user);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [userUploadProfileImage] = useUserUploadProfileImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: (user as any).name || "",
        phone: (user as any).phone || "",
      });
      setPreview((user as any)?.profile || null);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      // -------------------- update text fields as JSON --------------------
      await updateUserProfile({
        userId: user?.userId,
        name: formData.name,
        phone: formData.phone,
      }).unwrap();

      // -------------------- update image if exists (FormData) --------------------
      if (image) {
        const formDataBody = new FormData();
        formDataBody.append("profile", image); // backend expects key 'profile'
        await userUploadProfileImage(formDataBody).unwrap();
      }

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* ================= Profile Picture ================= */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Profile Picture
        </h2>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            <p className="text-sm text-gray-900 font-medium mb-1">
              Upload Profile image
            </p>
            <p className="text-xs text-gray-500 mb-1">
              Image format - jpg png jpeg
            </p>
            <p className="text-xs text-gray-500">
              Image Size - maximum 2 MB, Ratio - 1:1
            </p>

            <input
              type="file"
              accept="image/jpg,image/png,image/jpeg"
              onChange={handleImageChange}
              className="hidden"
              id="profile-upload"
            />
          </div>

          <label
            htmlFor="profile-upload"
            className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Upload Profile
          </label>
        </div>
      </div>

      {/* ================= Profile Information ================= */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Profile Information
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettingProfileTab;
