import React from "react";
import golmatha from "@/assets/image/golmatha.png";
import { Check } from "lucide-react";

const PricingSection: React.FC = () => {
  const features = [
    "No subscription (It's free to log on)",
    "In-Klein gets 10% of every deal",
    "Priority bid placement",
    "Advanced search filters",
    "Job alerts & notifications",
    "Analytics dashboard",
    "Priority support 24x7",
  ];

  return (
    <div className="py-16 px-4 bg-[#F8F9FF]">
      <div className="max-w-[1500px] mx-auto ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={golmatha} alt="logo" />
            <span className="text-[#37d7d9] text-xs font-medium uppercase tracking-widest">
              Simple & Transparent Pricing
            </span>
          </div>
          <h2 className="text-4xl font-medium text-[#0A0A0A] mb-3">
            Clear and transparent service fee
          </h2>
          <p className="text-[#717182] text-base mt-4">
            lear pricing, shown upfront so you always know what you’re paying
            for.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="rounded-2xl border-2 mt-16 border-[#0A1A3A] p-8 bg-[#FFF] max-w-2xl mx-auto">
          {/* Price Header */}
          <div className="text-center mb-8">
            <p className="text-gray-900 font-semibold text-lg mb-1">Free</p>
            <h3 className="text-5xl font-bold text-gray-900 mb-2">$0</h3>
            <p className="text-gray-500 text-sm">/month</p>
            <p className="text-gray-600 text-sm mt-3">
              Perfect for getting started
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-5 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="text-[#00A63E]" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="w-full cursor-pointer bg-[#0A1A3A] text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
