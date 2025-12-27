import React from "react"

export default function HowItWorks() {
  return (
    <div className="w-full min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-cyan-400 text-sm font-medium">construction-Web Company</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900">
            How In-Klein Elevators Works
          </h1>
        </div>

        {/* Steps Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Progress Line */}
          <div className="absolute -top-5 left-0 right-0 h-px bg-gray-300" 
               style={{ left: '16.66%', right: '16.66%' }}
          />
          
          {/* Step Numbers on Line */}
          <div className="absolute -top-5 left-0 right-0 flex justify-between items-center" 
               style={{ left: '16.66%', right: '16.66%' }}>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-medium text-gray-400 transform -translate-y-1/2">
              1
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-medium text-gray-400 transform -translate-y-1/2">
              2
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-medium text-gray-400 transform -translate-y-1/2">
              3
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {/* Step 1 - Post Your Elevator Job */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100">
              <div className="mb-8">
                <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                  <rect x="20" y="15" width="35" height="45" rx="2" stroke="#22D3EE" strokeWidth="2.5" fill="none"/>
                  <rect x="25" y="22" width="25" height="3" rx="1.5" fill="#22D3EE"/>
                  <rect x="25" y="30" width="25" height="2" rx="1" fill="#22D3EE" opacity="0.4"/>
                  <rect x="25" y="36" width="20" height="2" rx="1" fill="#22D3EE" opacity="0.4"/>
                  <rect x="25" y="42" width="22" height="2" rx="1" fill="#22D3EE" opacity="0.4"/>
                  <rect x="56" y="30" width="14" height="18" rx="2" fill="#A5F3FC"/>
                  <rect x="59" y="34" width="8" height="2" rx="1" fill="white"/>
                  <rect x="59" y="38" width="8" height="2" rx="1" fill="white"/>
                  <rect x="59" y="42" width="6" height="2" rx="1" fill="white"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Post Your Elevator Job
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                It's free and easy. Post your elevator project. Licensed companies browse opportunities matching their expertise and service area.
              </p>
            </div>

            {/* Step 2 - Compare Bids */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100">
              <div className="mb-8">
                <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                  <path d="M25 50L40 25L55 50H25Z" fill="#A5F3FC"/>
                  <path d="M25 50L40 25L55 50" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <line x1="35" y1="43" x2="45" y2="43" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="40" cy="35" r="2.5" fill="#22D3EE"/>
                  <rect x="22" y="54" width="36" height="5" rx="2" fill="#22D3EE"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Compare Bids
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Review bids and choose the competitive bids. Compare quotes, certifications, safety records, and past performance side-by-side.
              </p>
            </div>

            {/* Step 3 - Complete the Project */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100">
              <div className="mb-8">
                <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                  <rect x="28" y="15" width="24" height="50" rx="2" stroke="#22D3EE" strokeWidth="2.5" fill="none"/>
                  <rect x="32" y="20" width="16" height="8" rx="1.5" fill="#A5F3FC"/>
                  <rect x="32" y="32" width="16" height="8" rx="1.5" fill="#A5F3FC"/>
                  <rect x="32" y="44" width="16" height="8" rx="1.5" fill="#A5F3FC"/>
                  <line x1="24" y1="67" x2="56" y2="67" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="20" y1="72" x2="60" y2="72" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="36" y="24" width="8" height="1.5" rx="0.75" fill="#22D3EE"/>
                  <rect x="36" y="36" width="8" height="1.5" rx="0.75" fill="#22D3EE"/>
                  <rect x="36" y="48" width="8" height="1.5" rx="0.75" fill="#22D3EE"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Complete the Project
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Work begins with built-in compliance tracking. Milestone payments ensure quality and satisfaction throughout the project lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}