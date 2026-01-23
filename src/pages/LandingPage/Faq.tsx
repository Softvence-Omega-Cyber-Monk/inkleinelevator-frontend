import React, { useState } from 'react';
import { useGetAllFAQsQuery } from '@/Redux/features/AdminDashboard/contentManagement/faq/faqApi';

const FAQSection: React.FC = () => {
  const { data, isLoading } = useGetAllFAQsQuery();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Filter FAQs to only show those with at least a question
  const faqs = data?.data?.filter((faq) => faq.question?.trim()) || [];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <p className="text-cyan-400 text-sm mb-3 flex items-center justify-center gap-2">
              <span>←</span>
              <span>Frequently Asked Questions</span>
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Got Questions? We've Got Answers
            </h2>
            <p className="text-gray-600 text-base">
              Everything you need to know about using In-Klein Elevators
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">No FAQs available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-sm mb-3 flex items-center justify-center gap-2">
            <span>←</span>
            <span>Frequently Asked Questions</span>
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-gray-600 text-base">
            Everything you need to know about using In-Klein Elevators
          </p>
        </div>

        {/* FAQ Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories (kept for UI consistency, but not functional) */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 border-b border-[#DFE3E8] transition-colors bg-gray-900 text-white"
              >
                General Questions
              </button>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="lg:col-span-3">
            <div className="">
              {faqs.map((faq, index) => (
                <div
                  key={faq.qaCardId || index}
                  className={`border-b-[#E7E8EB] border-gray-200 last:border-b-0 ${
                    expandedIndex === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors border-b border-[#DFE3E8]"
                  >
                    <span className="text-gray-900 font-medium pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedIndex === index ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  
                  {expandedIndex === index && faq.ans && (
                    <div className="px-6 pb-5">
                      <div 
                        className="text-gray-600 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.ans }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;