import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobDetailsData } from '@/data/jobDetails';

// Types for props (preparing for Redux API)
interface Job {
    id: number;
    title: string;
    location: string;
    budget: string;
    budgetMin?: number;
    budgetMax?: number;
    postedTime: string;
    type: string;
    description: string;
}

interface BrowseJobsContentProps {
    jobs?: Job[];
    isLoading?: boolean;
}

// Browse Jobs Component - Now accepts props for Redux integration
const BrowseJobsContent = ({ jobs: propJobs, isLoading = false }: BrowseJobsContentProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Use prop jobs if provided (from Redux), otherwise use JSON data
    const allJobs = propJobs || jobDetailsData.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location.address,
        budget: job.budget.display,
        postedTime: job.postedDate,
        type: job.type,
        description: job.description,
    }));

    // Reset pagination when jobs change
    useEffect(() => {
        setCurrentPage(1);
    }, [propJobs]);

    // Pagination logic
    const totalPages = Math.ceil(allJobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedJobs = allJobs.slice(startIndex, endIndex);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading jobs...</div>
            </div>
        );
    }

    if (paginatedJobs.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No jobs found</div>
            </div>
        );
    }

    return (
        <>
            {/* Job Listings */}
            <div className="space-y-3 md:space-y-4">
                {paginatedJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 md:gap-4 mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-900 pr-2">{job.title}</h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                {job.type}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="break-words">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">Budget: {job.budget}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">Posted {job.postedTime}</span>
                            </div>
                        </div>

                        <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
                            {job.description}
                        </p>

                        <Link 
                            to={`/elevator/job-bid/${job.id}`}
                            className="w-full sm:w-auto bg-[#1e3a5f] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#2d4a6f] transition-colors inline-block text-center"
                        >
                            View Details & Bid
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-2 overflow-x-auto pb-2">
                    <button 
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                            currentPage === 1 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`px-2.5 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                                currentPage === page
                                    ? 'bg-[#1e3a5f] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                            currentPage === totalPages 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </>
    );
};

interface MyJob extends Job {
    status: string;
    statusColor: string;
}

interface MyJobsContentProps {
    jobs?: MyJob[];
    isLoading?: boolean;
}

// My Jobs Component - Now accepts props for Redux integration
const MyJobsContent = ({ jobs: propJobs, isLoading = false }: MyJobsContentProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Use prop jobs if provided (from Redux), otherwise use JSON data
    const allJobs = propJobs || jobDetailsData.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location.address,
        budget: job.budget.display,
        postedTime: job.postedDate,
        type: job.type,
        status: job.status || 'Active',
        statusColor: job.statusColor || 'bg-orange-500',
        description: job.description,
    }));

    // Reset pagination when jobs change
    useEffect(() => {
        setCurrentPage(1);
    }, [propJobs]);

    // Pagination logic
    const totalPages = Math.ceil(allJobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedJobs = allJobs.slice(startIndex, endIndex);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading jobs...</div>
            </div>
        );
    }

    if (paginatedJobs.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No jobs found</div>
            </div>
        );
    }

    return (
        <>
            {/* Job Listings */}
            <div className="space-y-3 md:space-y-4">
                {paginatedJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 md:gap-4 mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-900 pr-2">{job.title}</h2>
                            <div className="flex gap-2">
                                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                    {job.type}
                                </span>
                                <span className={`${job.statusColor} text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}>
                                    {job.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="break-words">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">Budget: {job.budget}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">Posted {job.postedTime}</span>
                            </div>
                        </div>

                        <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
                            {job.description}
                        </p>

                        <Link 
                            to={`/elevator/jobdetails/${job.id}`}
                            className="w-full sm:w-auto bg-[#1e3a5f] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#2d4a6f] transition-colors inline-block text-center"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-2 overflow-x-auto pb-2">
                    <button 
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                            currentPage === 1 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`px-2.5 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                                currentPage === page
                                    ? 'bg-[#1e3a5f] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                            currentPage === totalPages 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </>
    );
};

const BrowsJobsOverview = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [sortOption, setSortOption] = useState('Newest First');

    // Get all jobs data (can be replaced with Redux API later)
    const allBrowseJobs = jobDetailsData.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location.address,
        budget: job.budget.display,
        budgetMin: job.budget.min,
        budgetMax: job.budget.max,
        postedTime: job.postedDate,
        type: job.type,
        description: job.description,
    }));

    const allMyJobs = jobDetailsData.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location.address,
        budget: job.budget.display,
        budgetMin: job.budget.min,
        budgetMax: job.budget.max,
        postedTime: job.postedDate,
        type: job.type,
        status: job.status || 'Active',
        statusColor: job.statusColor || 'bg-orange-500',
        description: job.description,
    }));

    // Filter and sort logic for Browse Jobs
    const filteredBrowseJobs = useMemo(() => {
        let filtered = allBrowseJobs.filter((job) => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Location filter
            const matchesLocation = locationFilter === '' || 
                job.location.toLowerCase().includes(locationFilter.toLowerCase());
            
            // Job type filter
            const matchesJobType = jobTypeFilter === '' || 
                jobTypeFilter === 'Job Type' ||
                job.type === jobTypeFilter;
            
            return matchesSearch && matchesLocation && matchesJobType;
        });

        // Sort logic
        switch (sortOption) {
            case 'Newest First':
                filtered = filtered.sort((a, b) => b.id - a.id);
                break;
            case 'Oldest First':
                filtered = filtered.sort((a, b) => a.id - b.id);
                break;
            case 'Budget: High to Low':
                filtered = filtered.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
                break;
            case 'Budget: Low to High':
                filtered = filtered.sort((a, b) => (a.budgetMin || 0) - (b.budgetMin || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [searchQuery, locationFilter, jobTypeFilter, sortOption, allBrowseJobs]);

    // Filter and sort logic for My Jobs
    const filteredMyJobs = useMemo(() => {
        let filtered = allMyJobs.filter((job) => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Location filter
            const matchesLocation = locationFilter === '' || 
                job.location.toLowerCase().includes(locationFilter.toLowerCase());
            
            // Job type filter
            const matchesJobType = jobTypeFilter === '' || 
                jobTypeFilter === 'Job Type' ||
                job.type === jobTypeFilter;
            
            return matchesSearch && matchesLocation && matchesJobType;
        });

        // Sort logic
        switch (sortOption) {
            case 'Newest First':
                filtered = filtered.sort((a, b) => b.id - a.id);
                break;
            case 'Oldest First':
                filtered = filtered.sort((a, b) => a.id - b.id);
                break;
            case 'Budget: High to Low':
                filtered = filtered.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
                break;
            case 'Budget: Low to High':
                filtered = filtered.sort((a, b) => (a.budgetMin || 0) - (b.budgetMin || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [searchQuery, locationFilter, jobTypeFilter, sortOption, allMyJobs]);

    // Reset pagination when filters change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchQuery('');
        setLocationFilter('');
        setJobTypeFilter('');
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Browse Elevator Jobs</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Overview of your elevator jobs and Bids.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full sm:w-48 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>Budget: High to Low</option>
                        <option>Budget: Low to High</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="relative sm:col-span-2 md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search elevator jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 md:pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <input
                    type="text"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                    <select 
                        value={jobTypeFilter}
                        onChange={(e) => setJobTypeFilter(e.target.value)}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Job Type</option>
                        <option>Modernization</option>
                        <option>Maintenance</option>
                        <option>Repairs</option>
                        <option>Installation</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
                <button
                    onClick={() => handleTabChange('browse')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'browse'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Browse Jobs
                </button>
                <button
                    onClick={() => handleTabChange('my-jobs')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'my-jobs'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    My Jobs
                </button>
            </div>

            {/* Render Content Based on Active Tab */}
            {activeTab === 'browse' ? (
                <BrowseJobsContent jobs={filteredBrowseJobs} />
            ) : (
                <MyJobsContent jobs={filteredMyJobs} />
            )}
        </div>
    );
};

export default BrowsJobsOverview;