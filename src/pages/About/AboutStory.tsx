import React from "react";

const OurStory: React.FC = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Our Story
        </h2>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-base md:text-lg">
            In-Klein Elevator was founded in 2024 by Peyton Klein after
            conducting in-depth research and surrounding himself with elevator
            companies to better understand how the industry operates. Through
            firsthand exposure and industry insight, it became clear that
            elevator job bidding was largely handled through fragmented email
            chains—creating delays, limited visibility, and inefficiencies for
            both property managers and elevator companies.
          </p>

          <p className="text-base md:text-lg">
            Recognizing the need for a more modern solution, Peyton developed
            the first elevator-specific job bidding platform designed to
            streamline and improve the entire process.
          </p>

          <p className="text-base md:text-lg">
            In-Klein Elevator allows contractors and property managers to post
            elevator jobs directly on the platform, where licensed elevator
            companies can review project details, receive real-time updates, and
            submit competitive bids instantly. Unlike traditional email-based
            bidding, all bidding activity is centralized and transparent,
            allowing users to see who is actively bidding and track progress
            live.
          </p>

          <p className="text-base md:text-lg">
            Once a bid is selected, the job is awarded through the platform,
            enabling the elevator company to move forward with execution
            seamlessly. By replacing outdated workflows with real-time
            visibility and structured bidding, In-Klein Elevator makes elevator
            projects faster, smoother, and more transparent from start to
            finish.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
