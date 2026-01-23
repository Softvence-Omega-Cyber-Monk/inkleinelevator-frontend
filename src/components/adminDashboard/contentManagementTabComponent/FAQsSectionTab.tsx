import { Plus } from "lucide-react";

export default function FAQsSectionTab() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">FAQs</h2>
          <p className="text-sm text-gray-600">
            Manage answers of frequently asked questions
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
          <Plus size={16} />
          Add New FAQ
        </button>
      </div>

      <div className="space-y-4">
        {[1, 2].map((item) => (
          <div key={item} className="border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="How does bidding work?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ans
                </label>
                <textarea
                  placeholder="As in your service, direct link"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-4">Contact Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Help people to swiftly contact (placeholder)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+1 000 0000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="hello@inklein-elevatorproject.xyz"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            placeholder="www.inklein-elevatorproject.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <input
            type="text"
            placeholder="123 Street of Noun, New York, NY 10001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
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
