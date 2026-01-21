interface DetailsOverviewTabProps {
  singleJobData?: any; // can be typed better
  isLoading?: boolean;
}

export default function DetailsOverviewTab({
  singleJobData,
  isLoading = false,
}: DetailsOverviewTabProps) {
  // Skeleton styles
  const skeletonClass = "animate-pulse bg-gray-200 h-4 rounded-md w-full mb-2";

  if (isLoading) {
    return (
      <div>
        {/* Project Description Skeleton */}
        <div className="bg-[#FFF] p-8 rounded-lg shadow-sm min-h-52 border border-[#0A1A3A33]">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="space-y-2">
            <div className={skeletonClass} />
            <div className={skeletonClass} />
            <div className={skeletonClass} />
            <div className={skeletonClass} />
          </div>
        </div>

        {/* Technical Requirements & Elevator Specs Skeleton */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="flex-1 bg-[#FFF] p-8 rounded-lg shadow-md min-h-52 border border-[#0A1A3A33]"
            >
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className={skeletonClass} />
                <div className={skeletonClass} />
                <div className={skeletonClass} />
                <div className={skeletonClass} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //  Render actual data
  return (
    <div>
      <div className="bg-[#FFF] p-8 rounded-lg shadow-sm min-h-52 border border-[#0A1A3A33]">
        <h2 className="text-lg font-medium mb-4 text-[#0A0A0A]">
          Project Description
        </h2>

        <div
          className="
            text-[#0A0A0A] mt-6 text-base
            [&_ul]:list-disc [&_ul]:pl-6
            [&_ol]:list-decimal [&_ol]:pl-6
            [&_li]:mb-1
          "
          dangerouslySetInnerHTML={{
            __html: singleJobData?.projectDescription ?? "",
          }}
        />
      </div>

      <div className="mt-10 flex flex-col md:flex-row gap-6">
        {/* Technical Requirements */}
        <div className="flex-1 bg-[#FFF] p-8 rounded-lg shadow-md min-h-52 border border-[#0A1A3A33]">
          <h2 className="text-lg font-medium mb-4 text-[#0A0A0A]">
            Technical Requirements
          </h2>
          {singleJobData?.technicalRequermentAndCertification?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {singleJobData.technicalRequermentAndCertification.map(
                (tag: any, index: any) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 text-sm font-medium text-[#030213] bg-[#ECEEF2] rounded-md"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          )}
        </div>

        {/* Elevator Specifications */}
        <div className="flex-1 bg-[#FFF] p-8 rounded-lg shadow-md min-h-52 border border-[#0A1A3A33]">
          <h2 className="text-lg font-medium mb-4 text-[#0A0A0A]">
            Elevator Specifications
          </h2>
          <div className="grid grid-cols-1 gap-0">
            <div className="flex justify-between px-4 py-1 rounded">
              <span className="text-gray-500 text-sm">Elevator Type:</span>
              <span className="text-gray-900 text-sm">
                {singleJobData?.elevatorType}
              </span>
            </div>
            <div className="flex justify-between px-4 py-1 rounded">
              <span className="text-gray-500 text-sm">Number of Units:</span>
              <span className="text-gray-900 text-sm">
                {singleJobData?.numberOfElevator} Elevators
              </span>
            </div>
            <div className="flex justify-between px-4 py-1 rounded">
              <span className="text-gray-500 text-sm">Capacity:</span>
              <span className="text-gray-900 text-sm">
                {singleJobData?.capasity} lbs each
              </span>
            </div>
            <div className="flex justify-between px-4 py-1 rounded">
              <span className="text-gray-500 text-sm">Speed:</span>
              <span className="text-gray-900 text-sm">
                {singleJobData?.speed} FPM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
