import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobDetailsData } from '@/data/jobDetails';

interface Job {
    id: number;
    jobId?: string;
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
                            to={`/elevator/job-bid/${(job as Job).jobId || job.id}`}
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

export default BrowseJobsContent;