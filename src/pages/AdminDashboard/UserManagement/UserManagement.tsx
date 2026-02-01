import React, { useState } from "react";
import { Star, MoreHorizontal, X } from "lucide-react";
import { useGetAllUserByAdminQuery } from "@/Redux/features/AdminDashboard/adminApi";
import { BeatLoader } from "react-spinners";

// Types
interface User {
  userId: string;
  companyName?: string;
  name: string;
  email: string;
  role: string;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    jobs: number;
    bids: number;
    reviewsReceived: number;
  };
}

// Remove unused ApiResponse interface or use it properly
// interface ApiResponse {
//   data: {
//     data: User[];
//     meta?: {
//       total: number;
//       page: number;
//       limit: number;
//     };
//   };
//   success?: boolean;
//   message?: string;
// }

// Modal Component for Contractors
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contractor: User | null;
  onAction: (action: string) => void;
}> = ({ isOpen, onClose, contractor, onAction }) => {
  if (!isOpen || !contractor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Choose Action
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Company:</p>
            <p className="text-sm sm:text-base font-medium text-gray-900">
              {contractor.companyName || contractor.name}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
            <p className="text-xs sm:text-sm text-gray-900">
              {contractor.email}
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => onAction("Review")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Review</span>
            </button>
            <button
              onClick={() => onAction("Approve")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>Approve</span>
            </button>
            <button
              onClick={() => onAction("Reject")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>✕</span>
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component for Requesters
const RequesterActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  requester: User | null|any;
  onAction: (action: string) => void;
}> = ({ isOpen, onClose, requester, onAction }) => {
  if (!isOpen || !requester) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Choose Action
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Name:</p>
            <p className="text-sm sm:text-base font-medium text-gray-900">
              {requester.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
            <p className="text-xs sm:text-sm text-gray-900">
              {requester.email}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Phone:</p>
            <p className="text-xs sm:text-sm text-gray-900">
              {requester.phone || "Not provided"}
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => onAction("View Details")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>👁</span>
              <span>View Details</span>
            </button>
            <button
              onClick={() => onAction("Suspend")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>⏸</span>
              <span>Suspend</span>
            </button>
            <button
              onClick={() => onAction("Delete")}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <span>🗑</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SearchBar Component
// const SearchBar: React.FC<{ activeTab: string }> = ({ activeTab }) => {
//   return (
//     <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
//       <div className="flex-1 relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//         <input
//           type="text"
//           placeholder={
//             activeTab === "contractors"
//               ? "Search elevator jobs..."
//               : "Search requesters..."
//           }
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-auto sm:min-w-[140px]">
//         <option>
//           {activeTab === "contractors" ? "Jobs Type" : "Request Type"}
//         </option>
//       </select>
//     </div>
//   );
// };

// Tabs Component
const Tabs: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  contractorCount?: number;
  requesterCount?: number;
}> = ({ activeTab, setActiveTab, contractorCount = 0, requesterCount = 0 }) => {
  return (
    <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab("contractors")}
        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
          activeTab === "contractors"
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        Contractors ({contractorCount})
      </button>
      <button
        onClick={() => setActiveTab("requesters")}
        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
          activeTab === "requesters"
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        Requesters ({requesterCount})
      </button>
    </div>
  );
};

// ContractorCard Component
const ContractorCard: React.FC<{
  contractor: User;
  onActionClick: (contractor: User) => void;
}> = ({ contractor, onActionClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {contractor.companyName || contractor.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {contractor.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => onActionClick(contractor)}
          className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none flex-shrink-0"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Joined:</span>
          <span className="text-xs text-gray-900 font-medium">
            {new Date(contractor.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Bids:</span>
          <span className="text-xs text-gray-900 font-medium">
            {contractor._count?.bids || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-900 font-medium">
              {contractor.avgRating || 0}
            </span>
            <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

// RequesterCard Component
const RequesterCard: React.FC<{
  requester: User;
  onActionClick: (requester: User) => void;
}> = ({ requester, onActionClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {requester.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {requester.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => onActionClick(requester)}
          className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none flex-shrink-0"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Joined:</span>
          <span className="text-xs text-gray-900 font-medium">
            {new Date(requester.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Jobs:</span>
          <span className="text-xs text-gray-900 font-medium">
            {requester._count?.jobs || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-900 font-medium">
              {requester.avgRating || 0}
            </span>
            <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ContractorTable Component
const ContractorTable: React.FC<{ contractors: User[] }> = ({
  contractors,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<User | null>(
    null,
  );

  const handleActionClick = (action: string) => {
    console.log(
      `${action} clicked for contractor ${selectedContractor?.userId}`,
    );
    setIsModalOpen(false);
    setSelectedContractor(null);
  };

  const openModal = (contractor: User) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  // If no contractors, show empty state
  if (!contractors || contractors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No contractors found</p>
      </div>
    );
  }

  return (
    <>
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contractor={selectedContractor}
        onAction={handleActionClick}
      />

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {contractors.map((contractor) => (
          <ContractorCard
            key={contractor.userId}
            contractor={contractor}
            onActionClick={openModal}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Bids
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contractors.map((contractor) => (
                <tr
                  key={contractor.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contractor.companyName || contractor.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {contractor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(contractor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {contractor._count?.bids || 0}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {contractor.avgRating || 0}
                      </span>
                      <Star className="w-4 h-4 fill-current text-gray-900" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => openModal(contractor)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// RequesterTable Component
const RequesterTable: React.FC<{ requesters: User[] }> = ({ requesters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<User | null>(null);

  const handleActionClick = (action: string) => {
    console.log(`${action} clicked for requester ${selectedRequester?.userId}`);
    setIsModalOpen(false);
    setSelectedRequester(null);
  };

  const openModal = (requester: User) => {
    setSelectedRequester(requester);
    setIsModalOpen(true);
  };

  // If no requesters, show empty state
  if (!requesters || requesters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No requesters found</p>
      </div>
    );
  }

  return (
    <>
      <RequesterActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requester={selectedRequester}
        onAction={handleActionClick}
      />

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {requesters.map((requester) => (
          <RequesterCard
            key={requester.userId}
            requester={requester}
            onActionClick={openModal}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requesters.map((requester) => (
                <tr
                  key={requester.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {requester.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {requester.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(requester.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {requester._count?.jobs || 0}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {requester.avgRating || 0}
                      </span>
                      <Star className="w-4 h-4 fill-current text-gray-900" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => openModal(requester)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Previous
      </button>

      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
              currentPage === page
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {totalPages > 3 && (
        <>
          <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">
            ...
          </span>
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
              currentPage === totalPages
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next ›
      </button>
    </div>
  );
};

// Main Component
const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"contractors" | "requesters">(
    "contractors",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Define API response type
  interface ApiResponse {
    data: {
      data: User[];
      meta?: {
        total: number;
        page: number;
        limit: number;
      };
    };
    success?: boolean;
    message?: string;
  }

  // Fetch elevator contractors
  const { data: elevatorData, isLoading: isLoadingElevators } =
    useGetAllUserByAdminQuery({
      userType: "ELEVATOR",
      page: currentPage,
      limit: 10,
    });

  // Fetch requesters (you might need a different endpoint or parameter)
  const { data: requesterData, isLoading: isLoadingRequesters } =
    useGetAllUserByAdminQuery({
      userType: "HOMEOWNER", // Assuming this is the type for requesters
      page: currentPage,
      limit: 10,
    });
  console.log(elevatorData);
  // Type cast the API responses
  const elevatorResponse = elevatorData as unknown as ApiResponse;
  const requesterResponse = requesterData as unknown as ApiResponse;

  // Transform API data
  const contractors: User[] = elevatorResponse?.data?.data || [];
  const requesters: User[] = requesterResponse?.data?.data || [];

  // Get counts from meta or data length
  const contractorCount =
    elevatorResponse?.data?.meta?.total || contractors.length;
  const requesterCount =
    requesterResponse?.data?.meta?.total || requesters.length;
  const totalPages = elevatorResponse?.data?.meta?.total
    ? Math.ceil(elevatorResponse.data.meta.total / 10)
    : 1;

  if (activeTab === "contractors" && isLoadingElevators) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <BeatLoader color="#000000" size={15} />
      </div>
    );
  }

  if (activeTab === "requesters" && isLoadingRequesters) {
    return (
      <div className="bg-gray-50 p-4">
        <div className="mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading requesters...</p>
          </div>
        </div>
      </div>
    );
  }

  // Create a wrapper function for setActiveTab that accepts string
  const handleTabChange = (tab: string) => {
    if (tab === "contractors" || tab === "requesters") {
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            View, filter, and manage all Requesters and Contractors
          </p>
        </div>

        {/* Search Bar */}
        {/* <SearchBar activeTab={activeTab} /> */}

        {/* Tabs */}
        <Tabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          contractorCount={contractorCount}
          requesterCount={requesterCount}
        />

        {/* Section Title */}
        <div className="mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
            {activeTab === "contractors"
              ? "Contractor Accounts"
              : "Requester Accounts"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {activeTab === "contractors"
              ? "Approve, verify, and manage contractor accounts"
              : "View, manage, and monitor requester accounts"}
          </p>
        </div>

        {/* Conditional Table Rendering */}
        {activeTab === "contractors" ? (
          <ContractorTable contractors={contractors} />
        ) : (
          <RequesterTable requesters={requesters} />
        )}

        {/* Pagination */}
        {activeTab === "contractors" && contractors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {activeTab === "requesters" && requesters.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(requesterCount / 10)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
// import React, { useState } from 'react';
// import { Search, Star, MoreHorizontal, X } from 'lucide-react';
// import { useGetAllUserByAdminQuery } from '@/Redux/features/AdminDashboard/adminApi';

// // Types
// interface User {
//   userId: string;
//   companyName: string;
//   name: string;
//   email: string;
//   role: string;
//   avgRating: number;
//   createdAt: string;
//   updatedAt: string;
//   license?: string;
//   status?: string;
//   completedJobs?: number;
//   totalEarned?: string;
//   rating?: number;
//   phone?: string;
//   totalRequests?: number;
//   totalSpent?: string;
// }

// interface ApiResponse {
//   data: {
//     data: User[];
//     meta?: {
//       total: number;
//       page: number;
//       limit: number;
//     };
//   };
//   success?: boolean;
//   message?: string;
// }

// // Modal Component for Contractors
// const ActionModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   contractor: User | null;
//   onAction: (action: string) => void;
// }> = ({ isOpen, onClose, contractor, onAction }) => {
//   if (!isOpen || !contractor) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-900">Choose Action</h3>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <div className="p-4 sm:p-6">
//           <div className="mb-4">
//             <p className="text-xs sm:text-sm text-gray-600 mb-1">Company:</p>
//             <p className="text-sm sm:text-base font-medium text-gray-900">{contractor.companyName || contractor.name}</p>
//           </div>
//           <div className="mb-6">
//             <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
//             <p className="text-xs sm:text-sm text-gray-900">{contractor.email}</p>
//           </div>

//           <div className="space-y-2 sm:space-y-3">
//             <button
//               onClick={() => onAction('Review')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>📋</span>
//               <span>Review</span>
//             </button>
//             <button
//               onClick={() => onAction('Approve')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>✓</span>
//               <span>Approve</span>
//             </button>
//             <button
//               onClick={() => onAction('Reject')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>✕</span>
//               <span>Reject</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Modal Component for Requesters
// const RequesterActionModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   requester: User | null;
//   onAction: (action: string) => void;
// }> = ({ isOpen, onClose, requester, onAction }) => {
//   if (!isOpen || !requester) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-900">Choose Action</h3>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <div className="p-4 sm:p-6">
//           <div className="mb-4">
//             <p className="text-xs sm:text-sm text-gray-600 mb-1">Name:</p>
//             <p className="text-sm sm:text-base font-medium text-gray-900">{requester.name}</p>
//           </div>
//           <div className="mb-4">
//             <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
//             <p className="text-xs sm:text-sm text-gray-900">{requester.email}</p>
//           </div>
//           <div className="mb-6">
//             <p className="text-xs sm:text-sm text-gray-600 mb-1">Phone:</p>
//             <p className="text-xs sm:text-sm text-gray-900">{requester.phone || 'Not provided'}</p>
//           </div>

//           <div className="space-y-2 sm:space-y-3">
//             <button
//               onClick={() => onAction('View Details')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>👁</span>
//               <span>View Details</span>
//             </button>
//             <button
//               onClick={() => onAction('Suspend')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>⏸</span>
//               <span>Suspend</span>
//             </button>
//             <button
//               onClick={() => onAction('Delete')}
//               className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
//             >
//               <span>🗑</span>
//               <span>Delete</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // SearchBar Component
// const SearchBar: React.FC<{ activeTab: string }> = ({ activeTab }) => {
//   return (
//     <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
//       <div className="flex-1 relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//         <input
//           type="text"
//           placeholder={activeTab === 'contractors' ? 'Search elevator jobs...' : 'Search requesters...'}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-auto sm:min-w-[140px]">
//         <option>{activeTab === 'contractors' ? 'Jobs Type' : 'Request Type'}</option>
//       </select>
//     </div>
//   );
// };

// // Tabs Component
// const Tabs: React.FC<{
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   contractorCount?: number;
//   requesterCount?: number;
// }> = ({ activeTab, setActiveTab, contractorCount = 0, requesterCount = 0 }) => {
//   return (
//     <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
//       <button
//         onClick={() => setActiveTab('contractors')}
//         className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
//           activeTab === 'contractors'
//             ? 'bg-gray-900 text-white'
//             : 'bg-white text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         Contractors ({contractorCount})
//       </button>
//       <button
//         onClick={() => setActiveTab('requesters')}
//         className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
//           activeTab === 'requesters'
//             ? 'bg-gray-900 text-white'
//             : 'bg-white text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         Requesters ({requesterCount})
//       </button>
//     </div>
//   );
// };

// // ContractorCard Component
// const ContractorCard: React.FC<{
//   contractor: User;
//   onActionClick: (contractor: User) => void;
// }> = ({ contractor, onActionClick }) => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3 flex-1">
//           <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//             <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-sm font-medium text-gray-900 truncate">{contractor.companyName || contractor.name}</div>
//             <div className="text-xs text-gray-500 truncate">{contractor.email}</div>
//           </div>
//         </div>
//         <button
//           onClick={() => onActionClick(contractor)}
//           className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none flex-shrink-0"
//         >
//           <MoreHorizontal className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">License:</span>
//           <span className="text-xs text-gray-900 font-medium">{contractor.license || 'Not provided'}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Status:</span>
//           <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
//             {contractor.status || 'Active'}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Completed Jobs:</span>
//           <span className="text-xs text-gray-900 font-medium">{contractor.completedJobs || 0}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Earned:</span>
//           <span className="text-xs text-gray-900 font-medium">{contractor.totalEarned || '$0'}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Rating:</span>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-gray-900 font-medium">{contractor.avgRating || 0}</span>
//             <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // RequesterCard Component
// const RequesterCard: React.FC<{
//   requester: User;
//   onActionClick: (requester: User) => void;
// }> = ({ requester, onActionClick }) => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3 flex-1">
//           <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//             <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-sm font-medium text-gray-900 truncate">{requester.name}</div>
//             <div className="text-xs text-gray-500 truncate">{requester.email}</div>
//           </div>
//         </div>
//         <button
//           onClick={() => onActionClick(requester)}
//           className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none flex-shrink-0"
//         >
//           <MoreHorizontal className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Phone:</span>
//           <span className="text-xs text-gray-900 font-medium">{requester.phone || 'Not provided'}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Status:</span>
//           <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
//             {requester.status || 'Active'}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Requests:</span>
//           <span className="text-xs text-gray-900 font-medium">{requester.totalRequests || 0}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Spent:</span>
//           <span className="text-xs text-gray-900 font-medium">{requester.totalSpent || '$0'}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Rating:</span>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-gray-900 font-medium">{requester.avgRating || 0}</span>
//             <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ContractorTable Component
// const ContractorTable: React.FC<{ contractors: User[] }> = ({ contractors }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedContractor, setSelectedContractor] = useState<User | null>(null);

//   const handleActionClick = (action: string) => {
//     console.log(`${action} clicked for contractor ${selectedContractor?.userId}`);
//     setIsModalOpen(false);
//     setSelectedContractor(null);
//   };

//   const openModal = (contractor: User) => {
//     setSelectedContractor(contractor);
//     setIsModalOpen(true);
//   };

//   // If no contractors, show empty state
//   if (!contractors || contractors.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">No contractors found</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ActionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         contractor={selectedContractor}
//         onAction={handleActionClick}
//       />

//       {/* Mobile Card View */}
//       <div className="block lg:hidden space-y-3">
//         {contractors.map((contractor) => (
//           <ContractorCard
//             key={contractor.userId}
//             contractor={contractor}
//             onActionClick={openModal}
//           />
//         ))}
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Company</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">License</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Completed Jobs</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Total Earned</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {contractors.map((contractor) => (
//                 <tr key={contractor.userId} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//                         <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{contractor.companyName || contractor.name}</div>
//                         <div className="text-xs text-gray-500">{contractor.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.license || 'Not provided'}</td>
//                   <td className="py-4 px-4">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
//                       {contractor.status || 'Active'}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.completedJobs || 0}</td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.totalEarned || '$0'}</td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm text-gray-900">{contractor.avgRating || 0}</span>
//                       <Star className="w-4 h-4 fill-current text-gray-900" />
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <button
//                       onClick={() => openModal(contractor)}
//                       className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
//                     >
//                       <MoreHorizontal className="w-5 h-5 text-gray-600" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// // RequesterTable Component
// const RequesterTable: React.FC<{ requesters: User[] }> = ({ requesters }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRequester, setSelectedRequester] = useState<User | null>(null);

//   const handleActionClick = (action: string) => {
//     console.log(`${action} clicked for requester ${selectedRequester?.userId}`);
//     setIsModalOpen(false);
//     setSelectedRequester(null);
//   };

//   const openModal = (requester: User) => {
//     setSelectedRequester(requester);
//     setIsModalOpen(true);
//   };

//   // If no requesters, show empty state
//   if (!requesters || requesters.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">No requesters found</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <RequesterActionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         requester={selectedRequester}
//         onAction={handleActionClick}
//       />

//       {/* Mobile Card View */}
//       <div className="block lg:hidden space-y-3">
//         {requesters.map((requester) => (
//           <RequesterCard
//             key={requester.userId}
//             requester={requester}
//             onActionClick={openModal}
//           />
//         ))}
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Total Requests</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Total Spent</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {requesters.map((requester) => (
//                 <tr key={requester.userId} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//                         <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{requester.name}</div>
//                         <div className="text-xs text-gray-500">{requester.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.phone || 'Not provided'}</td>
//                   <td className="py-4 px-4">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
//                       {requester.status || 'Active'}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.totalRequests || 0}</td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.totalSpent || '$0'}</td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm text-gray-900">{requester.avgRating || 0}</span>
//                       <Star className="w-4 h-4 fill-current text-gray-900" />
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <button
//                       onClick={() => openModal(requester)}
//                       className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
//                     >
//                       <MoreHorizontal className="w-5 h-5 text-gray-600" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// // Pagination Component
// const Pagination: React.FC<{
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }> = ({ currentPage, totalPages, onPageChange }) => {
//   return (
//     <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
//       <button
//         onClick={() => onPageChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//         className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         ‹ Previous
//       </button>

//       {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
//             currentPage === page
//               ? 'bg-gray-900 text-white'
//               : 'text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {totalPages > 3 && (
//         <>
//           <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">...</span>
//           <button
//             onClick={() => onPageChange(totalPages)}
//             className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
//               currentPage === totalPages
//                 ? 'bg-gray-900 text-white'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             {totalPages}
//           </button>
//         </>
//       )}

//       <button
//         onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
//         disabled={currentPage === totalPages}
//         className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         Next ›
//       </button>
//     </div>
//   );
// };

// // Main Component
// const UserManagement: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'contractors' | 'requesters'>('contractors');
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch elevator contractors
//   const { data: elevatorData, isLoading: isLoadingElevators } = useGetAllUserByAdminQuery({
//     userType: "ELEVATOR",
//     page: currentPage,
//     limit: 10
//   });

//   // Fetch requesters (you might need a different endpoint or parameter)
//   const { data: requesterData, isLoading: isLoadingRequesters } = useGetAllUserByAdminQuery({
//     userType: "HOMEOWNER", // Assuming this is the type for requesters
//     page: currentPage,
//     limit: 10
//   });

//   // Transform API data
//   const contractors: User[] = elevatorData?.data?.data || [];
//   const requesters: User[] = requesterData?.data?.data || [];

//   // Get counts from meta or data length
//   const contractorCount = elevatorData?.data?.meta?.total || contractors.length;
//   const requesterCount = requesterData?.data?.meta?.total || requesters.length;
//   const totalPages = elevatorData?.data?.meta?.total
//     ? Math.ceil(elevatorData.data.meta.total / 10)
//     : 1;

//   if (activeTab === 'contractors' && isLoadingElevators) {
//     return (
//       <div className="bg-gray-50 p-4">
//         <div className="mx-auto">
//           <div className="text-center py-8">
//             <p className="text-gray-500">Loading contractors...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (activeTab === 'requesters' && isLoadingRequesters) {
//     return (
//       <div className="bg-gray-50 p-4">
//         <div className="mx-auto">
//           <div className="text-center py-8">
//             <p className="text-gray-500">Loading requesters...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 p-4">
//       <div className="mx-auto">
//         {/* Header */}
//         <div className="mb-4 sm:mb-6">
//           <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">User Management</h1>
//           <p className="text-xs sm:text-sm text-gray-600">View, filter, and manage all Requesters and Contractors</p>
//         </div>

//         {/* Search Bar */}
//         <SearchBar activeTab={activeTab} />

//         {/* Tabs */}
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           contractorCount={contractorCount}
//           requesterCount={requesterCount}
//         />

//         {/* Section Title */}
//         <div className="mb-3 sm:mb-4">
//           <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
//             {activeTab === 'contractors' ? 'Contractor Accounts' : 'Requester Accounts'}
//           </h2>
//           <p className="text-xs sm:text-sm text-gray-600">
//             {activeTab === 'contractors'
//               ? 'Approve, verify, and manage contractor accounts'
//               : 'View, manage, and monitor requester accounts'}
//           </p>
//         </div>

//         {/* Conditional Table Rendering */}
//         {activeTab === 'contractors' ? (
//           <ContractorTable contractors={contractors} />
//         ) : (
//           <RequesterTable requesters={requesters} />
//         )}

//         {/* Pagination */}
//         {activeTab === 'contractors' && contractors.length > 0 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         )}
//         {activeTab === 'requesters' && requesters.length > 0 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(requesterCount / 10)}
//             onPageChange={setCurrentPage}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
