import { useRef, useState, useEffect } from "react";
import {
  useGetHeroContentQuery,
  useUploadHeroContentImageMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/contentManagementApi";
import { toast } from "sonner";

export default function UploadMediaTab() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [uploadHeroContentImage, { isLoading }] =
    useUploadHeroContentImageMutation();

  const {
    data,
    isLoading: isHeroContentLoading,
    refetch,
  } = useGetHeroContentQuery({});
  const heroContent = data?.data;

  // ✅ SET DEFAULT IMAGE FROM BACKEND
  useEffect(() => {
    if (heroContent?.image && !selectedFile) {
      setPreview(heroContent.image);
    }
  }, [heroContent, selectedFile]);

  // open file picker
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // user selects image (NO API CALL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // upload on save
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profile", selectedFile);

    try {
      const response = await uploadHeroContentImage(formData).unwrap();

      // ✅ success toast from backend
      if (response?.success) {
        toast.success(response.message || "Upload successful");

        // optional: update preview instantly
        if (response?.data?.image) {
          setPreview(response.data.image);
        }
        refetch();
        setSelectedFile(null);
      } else {
        toast.error(response?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error(error);

      // ✅ backend error message (if exists)
      toast.error(
        error?.data?.message || "Something went wrong while uploading",
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Upload Media</h2>
        <p className="text-sm text-gray-600">Upload any Media</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>

        {/* Upload Box */}
        <div
          onClick={handleClick}
          className="border-2 border-gray-300 rounded-lg p-8 md:p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center border-2 border-dashed border-gray-400 max-w-md p-4">
            {isHeroContentLoading ? (
              <p className="text-sm text-gray-500">Loading image...</p>
            ) : preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-contain mb-4 rounded-md"
              />
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </>
            )}
            <p className="text-sm text-gray-600">Click to upload image</p>
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Save Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
}
