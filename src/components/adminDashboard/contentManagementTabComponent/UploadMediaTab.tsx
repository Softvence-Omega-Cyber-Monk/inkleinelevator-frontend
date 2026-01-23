import { Plus } from "lucide-react";

export default function UploadMediaTab() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Upload Media
          </h2>
          <p className="text-sm text-gray-600">Upload any Media</p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
          <Plus size={16} />
          Add New FAQ
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Area
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>Hero Section</option>
            <option>About Section</option>
            <option>Process Steps</option>
            <option>Why Us Section</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center">
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
              <p className="text-sm text-gray-600 mb-1">
                <span className="text-blue-600 underline">Click to upload</span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (Max: 800x400px)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
