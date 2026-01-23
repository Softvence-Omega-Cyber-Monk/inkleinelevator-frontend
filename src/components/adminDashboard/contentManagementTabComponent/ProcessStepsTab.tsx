export default function ProcessStepsTab() {
  const steps = [1, 2, 3];

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        How It Works Section
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Provide steps that outline your process
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            placeholder="Elevator work (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            placeholder="Enter section title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Process Steps
        </label>

        {steps.map((step, index) => (
          <div key={step} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-red-500 border border-red-500 rounded px-2 py-1">
                Step {index + 1}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  placeholder="Enter step (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Step Description
                </label>
                <textarea
                  placeholder="At G-tex Elevator, our values to contribute..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
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
