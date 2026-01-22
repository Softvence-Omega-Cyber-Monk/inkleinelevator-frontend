import React, { useState, useEffect } from 'react';
import { Search, Star, MoreHorizontal, X, CheckCircle, XCircle, Eye, Pause, Trash2, FileText, UserCheck, UserX } from 'lucide-react';
import { useGetAllUserByAdminQuery, useVerifyUserStatusMutation } from '@/Redux/features/AdminDashboard/adminApi';

// Types based on API response
interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  companyName: string | null;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    jobs: number;
    bids: number;
    reviewsReceived: number;
  };
  avgRating: number;
  verifidStatus?: string;
}

interface Contractor extends User {
  licenseNo?: string;
  licenseInfo?: string;
  businessAddress?: string;
  servicesType?: string;
}

interface Requester extends User {
  // Additional requester-specific fields if any
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: PaginationMeta;
    data: User[];
  };
}

// Modal Component for Contractors
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor | null;
  onAction: (action: string, contractorId: string) => void;
}> = ({ isOpen, onClose, contractor, onAction }) => {
  if (!isOpen || !contractor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Choose Action</h3>
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
            <p className="text-sm sm:text-base font-medium text-gray-900">{contractor.companyName || contractor.name}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
            <p className="text-xs sm:text-sm text-gray-900">{contractor.email}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => onAction('Review', contractor.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Review Details</span>
            </button>
            <button
              onClick={() => onAction('Approve', contractor.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve/Verify</span>
            </button>
            <button
              onClick={() => onAction('Reject', contractor.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
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
  requester: Requester | null;
  onAction: (action: string, requesterId: string) => void;
}> = ({ isOpen, onClose, requester, onAction }) => {
  if (!isOpen || !requester) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Choose Action</h3>
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
            <p className="text-sm sm:text-base font-medium text-gray-900">{requester.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Email:</p>
            <p className="text-xs sm:text-sm text-gray-900">{requester.email}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Phone:</p>
            <p className="text-xs sm:text-sm text-gray-900">{requester.phone || 'N/A'}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => onAction('View Details', requester.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            <button
              onClick={() => onAction('Suspend', requester.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" />
              <span>Suspend</span>
            </button>
            <button
              onClick={() => onAction('Delete', requester.userId)}
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SearchBar Component
const SearchBar: React.FC<{ 
  activeTab: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}> = ({ activeTab, searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={activeTab === 'contractors' ? 'Search contractors...' : 'Search requesters...'}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-auto sm:min-w-[140px]">
        <option>All Status</option>
        <option>Verified</option>
        <option>Pending</option>
        <option>Rejected</option>
      </select>
    </div>
  );
};

// Tabs Component
const Tabs: React.FC<{ 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  contractorCount: number;
  requesterCount: number;
}> = ({ activeTab, setActiveTab, contractorCount, requesterCount }) => {
  return (
    <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab('contractors')}
        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
          activeTab === 'contractors'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        Contractors ({contractorCount})
      </button>
      <button
        onClick={() => setActiveTab('requesters')}
        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
          activeTab === 'requesters'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        Requesters ({requesterCount})
      </button>
    </div>
  );
};

// ContractorCard Component
const ContractorCard: React.FC<{ 
  contractor: Contractor; 
  onActionClick: (contractor: Contractor) => void;
  onVerifyClick: (userId: string) => void;
  isLoading?: boolean;
}> = ({ contractor, onActionClick, onVerifyClick, isLoading = false }) => {
  const getStatusColor = (status?: string) => {
    if (status === 'VERIFID') return 'bg-green-100 text-green-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status?: string) => {
    if (status === 'VERIFID') return 'Verified';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending';
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {contractor.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{contractor.companyName || contractor.name}</div>
            <div className="text-xs text-gray-500 truncate">{contractor.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onVerifyClick(contractor.userId)}
            className={`p-1.5 rounded transition-colors focus:outline-none flex-shrink-0 ${
              contractor.verifidStatus === 'VERIFID' 
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            }`}
            title={contractor.verifidStatus === 'VERIFID' ? 'Verified' : 'Click to verify'}
          >
            {contractor.verifidStatus === 'VERIFID' ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
          </button>
          <button 
            onClick={() => onActionClick(contractor)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors focus:outline-none flex-shrink-0"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">License:</span>
          <span className="text-xs text-gray-900 font-medium">{contractor.licenseNo || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Status:</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(contractor.verifidStatus)}`}>
            {getStatusText(contractor.verifidStatus)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Jobs Posted:</span>
          <span className="text-xs text-gray-900 font-medium">{contractor._count.jobs}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Bids Made:</span>
          <span className="text-xs text-gray-900 font-medium">{contractor._count.bids}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-900 font-medium">{contractor.avgRating.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

// RequesterCard Component
const RequesterCard: React.FC<{ 
  requester: Requester; 
  onActionClick: (requester: Requester) => void;
  isLoading?: boolean;
}> = ({ requester, onActionClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {requester.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{requester.name}</div>
            <div className="text-xs text-gray-500 truncate">{requester.email}</div>
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
          <span className="text-xs text-gray-600">Phone:</span>
          <span className="text-xs text-gray-900 font-medium">{requester.phone || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Status:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
            Active
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Jobs Posted:</span>
          <span className="text-xs text-gray-900 font-medium">{requester._count.jobs}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Bids Made:</span>
          <span className="text-xs text-gray-900 font-medium">{requester._count.bids}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-900 font-medium">{requester.avgRating.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ContractorTable Component
const ContractorTable: React.FC<{ 
  contractors: Contractor[];
  isLoading?: boolean;
  onAction: (action: string, contractorId: string) => void;
  onVerify: (userId: string) => void;
}> = ({ contractors, isLoading = false, onAction, onVerify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const getStatusColor = (status?: string) => {
    if (status === 'VERIFID') return 'bg-green-100 text-green-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status?: string) => {
    if (status === 'VERIFID') return 'Verified';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending';
  };

  const handleActionClick = (action: string) => {
    if (selectedContractor) {
      onAction(action, selectedContractor.userId);
    }
    setIsModalOpen(false);
    setSelectedContractor(null);
  };

  const openModal = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 lg:space-y-0">
        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
            ))}
          </div>
        </div>
        <div className="block lg:hidden space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
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
            onVerifyClick={onVerify}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Company/Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">License No</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Jobs Posted</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Bids Made</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contractors.map((contractor) => (
                <tr key={contractor.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {contractor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contractor.companyName || contractor.name}</div>
                        <div className="text-xs text-gray-500">{contractor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{contractor.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{contractor.licenseNo || 'N/A'}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(contractor.verifidStatus)}`}>
                      {getStatusText(contractor.verifidStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{contractor._count.jobs}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{contractor._count.bids}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">{contractor.avgRating.toFixed(1)}</span>
                      <Star className="w-4 h-4 fill-current text-gray-900" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onVerify(contractor.userId)}
                        className={`p-1.5 rounded transition-colors focus:outline-none ${
                          contractor.verifidStatus === 'VERIFID' 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        }`}
                        title={contractor.verifidStatus === 'VERIFID' ? 'Verified' : 'Click to verify'}
                      >
                        {contractor.verifidStatus === 'VERIFID' ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => openModal(contractor)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
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
const RequesterTable: React.FC<{ 
  requesters: Requester[];
  isLoading?: boolean;
  onAction: (action: string, requesterId: string) => void;
}> = ({ requesters, isLoading = false, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<Requester | null>(null);

  const handleActionClick = (action: string) => {
    if (selectedRequester) {
      onAction(action, selectedRequester.userId);
    }
    setIsModalOpen(false);
    setSelectedRequester(null);
  };

  const openModal = (requester: Requester) => {
    setSelectedRequester(requester);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 lg:space-y-0">
        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
            ))}
          </div>
        </div>
        <div className="block lg:hidden space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
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
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Jobs Posted</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Bids Made</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requesters.map((requester) => (
                <tr key={requester.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {requester.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{requester.name}</div>
                        <div className="text-xs text-gray-500">{requester.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{requester.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{requester.phone || 'N/A'}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{requester._count.jobs}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{requester._count.bids}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">{requester.avgRating.toFixed(1)}</span>
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
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Previous
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
              currentPage === 1
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
            currentPage === page
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
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
  const [activeTab, setActiveTab] = useState<'contractors' | 'requesters'>('contractors');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [userType, setUserType] = useState<'USER' | 'CONTRACTOR'>('USER');

  // Fetch data based on active tab
  const { data, isLoading, error, refetch } = useGetAllUserByAdminQuery({
    userType: userType,
    searchTerm: searchTerm || undefined,
    page: currentPage,
    limit: limit
  });

  const [verifyUserStatus, { isLoading: isVerifying }] = useVerifyUserStatusMutation();

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      // You can add a toast notification here
    }
  }, [error]);

  // Update userType when tab changes
  useEffect(() => {
    if (activeTab === 'contractors') {
      setUserType('CONTRACTOR');
    } else {
      setUserType('USER');
    }
    setCurrentPage(1); // Reset to first page when tab changes
  }, [activeTab]);

  // Handle verify action
  const handleVerify = async (userId: string) => {
    try {
      await verifyUserStatus(userId).unwrap();
      // Show success message
      alert('User verification status updated successfully');
      // Refresh data
      refetch();
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to update verification status');
    }
  };

  // Handle other actions from modals
  const handleAction = async (action: string, userId: string) => {
    console.log(`${action} action performed on user ${userId}`);
    
    if (action === 'Approve') {
      await handleVerify(userId);
    } else {
      // For other actions (Review, Reject, Suspend, Delete, View Details)
      alert(`${action} action would be performed on user ${userId}`);
      // Here you would implement the actual API calls for these actions
    }
  };

  // Filter and transform API data
  const contractors: Contractor[] = React.useMemo(() => {
    if (!data?.data?.data) return [];
    
    return data.data.data
      .filter(user => user.role === 'CONTRACTOR' || userType === 'CONTRACTOR')
      .map(user => ({
        ...user,
        phone: user.phone || 'N/A',
        licenseNo: 'N/A', // This should come from your API
        licenseInfo: 'N/A', // This should come from your API
        businessAddress: 'N/A', // This should come from your API
        servicesType: 'N/A', // This should come from your API
      }));
  }, [data, userType]);

  const requesters: Requester[] = React.useMemo(() => {
    if (!data?.data?.data) return [];
    
    return data.data.data
      .filter(user => user.role === 'USER' && userType === 'USER')
      .map(user => ({
        ...user,
        phone: user.phone || 'N/A',
      }));
  }, [data, userType]);

  // Calculate counts
  const contractorCount = contractors.length;
  const requesterCount = requesters.length;
  const totalPages = data?.data?.meta?.totalPage || 1;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-600">View, filter, and manage all Requesters and Contractors</p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          activeTab={activeTab} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Tabs */}
        <Tabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          contractorCount={contractorCount}
          requesterCount={requesterCount}
        />

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Error loading users. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
            {activeTab === 'contractors' ? 'Contractor Accounts' : 'Requester Accounts'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {activeTab === 'contractors' 
              ? `Showing ${contractors.length} of ${data?.data?.meta?.total || 0} contractors`
              : `Showing ${requesters.length} of ${data?.data?.meta?.total || 0} requesters`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Conditional Table Rendering */}
        {!isLoading && !error && (
          <>
            {activeTab === 'contractors' ? (
              <ContractorTable 
                contractors={contractors} 
                onAction={handleAction}
                onVerify={handleVerify}
              />
            ) : (
              <RequesterTable 
                requesters={requesters} 
                onAction={handleAction}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (activeTab === 'contractors' ? contractors.length === 0 : requesters.length === 0) && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-3">👤</div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-xs text-gray-600">
              {searchTerm 
                ? `No ${activeTab} match your search "${searchTerm}"`
                : `There are no ${activeTab} in the system yet`}
            </p>
          </div>
        )}

        {/* Verification Loading Overlay */}
        {isVerifying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Updating verification status...</p>
            </div>
          </div>
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
// interface Contractor {
//   id: number;
//   company: string;
//   email: string;
//   license: string;
//   status: string;
//   completedJobs: number;
//   totalEarned: string;
//   rating: number;
// }

// interface Requester {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   status: string;
//   totalRequests: number;
//   totalSpent: string;
//   rating: number;
// }

// // Modal Component for Contractors
// const ActionModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   contractor: Contractor | null;
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
//             <p className="text-sm sm:text-base font-medium text-gray-900">{contractor.company}</p>
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
//   requester: Requester | null;
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
//             <p className="text-xs sm:text-sm text-gray-900">{requester.phone}</p>
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
// const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
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
//         Contractors (4)
//       </button>
//       <button
//         onClick={() => setActiveTab('requesters')}
//         className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
//           activeTab === 'requesters'
//             ? 'bg-gray-900 text-white'
//             : 'bg-white text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         Requesters (4)
//       </button>
//     </div>
//   );
// };

// // ContractorCard Component
// const ContractorCard: React.FC<{ contractor: Contractor; onActionClick: (contractor: Contractor) => void }> = ({ contractor, onActionClick }) => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3 flex-1">
//           <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//             <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-sm font-medium text-gray-900 truncate">{contractor.company}</div>
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
//           <span className="text-xs text-gray-900 font-medium">{contractor.license}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Status:</span>
//           <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
//             {contractor.status}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Completed Jobs:</span>
//           <span className="text-xs text-gray-900 font-medium">{contractor.completedJobs}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Earned:</span>
//           <span className="text-xs text-gray-900 font-medium">{contractor.totalEarned}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Rating:</span>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-gray-900 font-medium">{contractor.rating}</span>
//             <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // RequesterCard Component
// const RequesterCard: React.FC<{ requester: Requester; onActionClick: (requester: Requester) => void }> = ({ requester, onActionClick }) => {
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
//           <span className="text-xs text-gray-900 font-medium">{requester.phone}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Status:</span>
//           <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
//             {requester.status}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Requests:</span>
//           <span className="text-xs text-gray-900 font-medium">{requester.totalRequests}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Total Spent:</span>
//           <span className="text-xs text-gray-900 font-medium">{requester.totalSpent}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Rating:</span>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-gray-900 font-medium">{requester.rating}</span>
//             <Star className="w-3.5 h-3.5 fill-current text-gray-900" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ContractorTable Component
// const ContractorTable: React.FC<{ contractors: Contractor[] }> = ({ contractors }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

//   const handleActionClick = (action: string) => {
//     console.log(`${action} clicked for contractor ${selectedContractor?.id}`);
//     setIsModalOpen(false);
//     setSelectedContractor(null);
//   };

//   const openModal = (contractor: Contractor) => {
//     setSelectedContractor(contractor);
//     setIsModalOpen(true);
//   };

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
//             key={contractor.id} 
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
//                 <tr key={contractor.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//                         <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{contractor.company}</div>
//                         <div className="text-xs text-gray-500">{contractor.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.license}</td>
//                   <td className="py-4 px-4">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
//                       {contractor.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.completedJobs}</td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{contractor.totalEarned}</td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm text-gray-900">{contractor.rating}</span>
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
// const RequesterTable: React.FC<{ requesters: Requester[] }> = ({ requesters }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRequester, setSelectedRequester] = useState<Requester | null>(null);

//   const handleActionClick = (action: string) => {
//     console.log(`${action} clicked for requester ${selectedRequester?.id}`);
//     setIsModalOpen(false);
//     setSelectedRequester(null);
//   };

//   const openModal = (requester: Requester) => {
//     setSelectedRequester(requester);
//     setIsModalOpen(true);
//   };

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
//             key={requester.id} 
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
//                 <tr key={requester.id} className="hover:bg-gray-50 transition-colors">
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
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.phone}</td>
//                   <td className="py-4 px-4">
//                     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
//                       {requester.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.totalRequests}</td>
//                   <td className="py-4 px-4 text-sm text-gray-900">{requester.totalSpent}</td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm text-gray-900">{requester.rating}</span>
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
// const Pagination: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);

//   return (
//     <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
//       <button
//         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//         className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
//       >
//         ‹ Previous
//       </button>
//       <button
//         onClick={() => setCurrentPage(1)}
//         className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
//           currentPage === 1
//             ? 'bg-gray-900 text-white'
//             : 'text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         1
//       </button>
//       <button
//         onClick={() => setCurrentPage(2)}
//         className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
//           currentPage === 2
//             ? 'bg-gray-900 text-white'
//             : 'text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         2
//       </button>
//       <button
//         onClick={() => setCurrentPage(3)}
//         className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
//           currentPage === 3
//             ? 'bg-gray-900 text-white'
//             : 'text-gray-600 hover:bg-gray-100'
//         }`}
//       >
//         3
//       </button>
//       <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">...</span>
//       <button
//         onClick={() => setCurrentPage(currentPage + 1)}
//         className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
//       >
//         Next ›
//       </button>
//     </div>
//   );
// };

// // Main Component
// const UserManagement: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('contractors');

//   const contractors: Contractor[] = Array(7).fill(null).map((_, i) => ({
//     id: i + 1,
//     company: 'Elite Elevator Solutions',
//     email: 'contact@eliteelevators.com',
//     license: 'EL-12345-NY',
//     status: 'Verified',
//     completedJobs: 87,
//     totalEarned: '$195,000',
//     rating: 4.9,
//   }));

//   const requesters: Requester[] = Array(7).fill(null).map((_, i) => ({
//     id: i + 1,
//     name: 'John Smith',
//     email: 'john.smith@company.com',
//     phone: '+1 (555) 123-4567',
//     status: 'Active',
//     totalRequests: 24,
//     totalSpent: '$48,500',
//     rating: 4.8,
//   }));


// const {data:useData}=useGetAllUserByAdminQuery()
// console.log(useData)

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
//         <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
//         <Pagination />
//       </div>
//     </div>
//   );
// };

// export default UserManagement;