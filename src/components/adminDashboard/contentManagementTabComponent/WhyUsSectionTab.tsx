import {
  AlignLeft,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

export default function WhyUsSectionTab() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        Why Us?/For Section
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage what sets your service apart
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            placeholder="Provide services from trusted sub"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            placeholder="Enter the title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            placeholder="Write a short compelling thought"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      {/* Job Requisitions */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Job Requisitions</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Card Title
            </label>
            <input
              type="text"
              placeholder="Enter Your Answer (Ai)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Card Subtitle
            </label>
            <input
              type="text"
              placeholder="G-r (Ans Elevator, our values to contribute..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Bullet Points
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bold size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Italic size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Underline size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <List size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ListOrdered size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <AlignLeft size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Link2 size={14} />
              </button>
              <span className="ml-auto">15 Rich Text</span>
            </div>
            <textarea
              placeholder="Describe key elements in a clean, double-clicked or click for adding new values, and describe, save bullet(or very specific business communication)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Contractors */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-4">Contractors</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Card Title
            </label>
            <input
              type="text"
              placeholder="Enter Your Answer (Ai)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Card Subtitle
            </label>
            <input
              type="text"
              placeholder="G-r (Ans Elevator, our values to contribute..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Bullet Points
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bold size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Italic size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Underline size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <List size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ListOrdered size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <AlignLeft size={14} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Link2 size={14} />
              </button>
              <span className="ml-auto">15 Rich Text</span>
            </div>
            <textarea
              placeholder="Describe key elements in a clean, double-clicked or click for adding new values, and describe, save bullet(or very specific business communication)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Save Changes
        </button>
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Reset to Default
        </button>
      </div>
    </div>
  );
}
