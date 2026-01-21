import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useGetAllJobsQuery } from '@/Redux/features/userDa/userJob/userJobApi';
import BrowseJobsContent from './BrowseJobsContent';
import MyJobsContent from './MyJobsContent';

interface TransformedJob {
    id: number;
    jobId?: string;
    title: string;
    location: string;
    budget: string;
    budgetMin: number;
    budgetMax: number;
    postedTime: string;
    createdAt: number;
    type: string;
    description: string;
}

interface TransformedMyJob extends TransformedJob {
    status: string;
    statusColor: string;
}

const BrowsJobsOverview = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [sortOption, setSortOption] = useState('Newest First');

    // Fetch all jobs using Redux API
    const { data: jobsData, isLoading } = useGetAllJobsQuery({
        page: 1,
        limit: 1000, // Get all jobs for filtering/sorting
        search: searchQuery || undefined,
        jobType: jobTypeFilter && jobTypeFilter !== 'Job Type' ? jobTypeFilter : undefined,
    });

    // Helper function to strip HTML tags
    const stripHtml = (html: string) => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Helper function to parse budget range (format: "6300-3594")
    const parseBudget = (budgetStr: string) => {
        if (!budgetStr) return { min: 0, max: 0, display: '$0' };
        const parts = budgetStr.split('-').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
        if (parts.length === 2) {
            return {
                min: Math.min(parts[0], parts[1]),
                max: Math.max(parts[0], parts[1]),
                display: `$${Math.min(parts[0], parts[1])}-$${Math.max(parts[0], parts[1])}`
            };
        }
        return { min: 0, max: 0, display: `$${budgetStr}` };
    };

    // Helper function to capitalize first letter
    const capitalize = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Transform API response to match component structure
    const allBrowseJobs = useMemo((): TransformedJob[] => {
        if (!jobsData?.data?.jobs || !Array.isArray(jobsData.data.jobs)) return [];
        
        return jobsData.data.jobs.map((job: any, index: number): TransformedJob => {
            const budget = parseBudget(job.estimitedBudget || '');
            const locationParts = [
                job.streetAddress,
                job.address,
                job.city,
                job.zipCode
            ].filter(Boolean);
            const fullLocation = locationParts.join(', ') || job.address || '';

            return {
                id: index + 1, // Use index for React key
                jobId: job.jobId, // Keep original jobId for navigation
                title: job.jobTitle || '',
                location: fullLocation,
                budget: budget.display,
                budgetMin: budget.min,
                budgetMax: budget.max,
                postedTime: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '',
                createdAt: job.createdAt ? new Date(job.createdAt).getTime() : 0, // For sorting
                type: capitalize(job.jobType || ''),
                description: stripHtml(job.projectDescription || ''),
            };
        });
    }, [jobsData]);

    const allMyJobs = useMemo((): TransformedMyJob[] => {
        if (!jobsData?.data?.jobs || !Array.isArray(jobsData.data.jobs)) return [];
        
        return jobsData.data.jobs.map((job: any, index: number): TransformedMyJob => {
            const budget = parseBudget(job.estimitedBudget || '');
            const locationParts = [
                job.streetAddress,
                job.address,
                job.city,
                job.zipCode
            ].filter(Boolean);
            const fullLocation = locationParts.join(', ') || job.address || '';

            // Map jobStatus to status and statusColor
            const jobStatus = job.jobStatus || 'OPEN';
            const statusMap: Record<string, { status: string; color: string }> = {
                'OPEN': { status: 'Active', color: 'bg-orange-500' },
                'CLOSED': { status: 'Completed', color: 'bg-green-500' },
                'PENDING': { status: 'Pending', color: 'bg-yellow-500' },
            };
            const statusInfo = statusMap[jobStatus] || { status: 'Active', color: 'bg-orange-500' };

            return {
                id: index + 1, // Use index for React key
                jobId: job.jobId, // Keep original jobId for navigation
                title: job.jobTitle || '',
                location: fullLocation,
                budget: budget.display,
                budgetMin: budget.min,
                budgetMax: budget.max,
                postedTime: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '',
                createdAt: job.createdAt ? new Date(job.createdAt).getTime() : 0, // For sorting
                type: capitalize(job.jobType || ''),
                status: statusInfo.status,
                statusColor: statusInfo.color,
                description: stripHtml(job.projectDescription || ''),
            };
        });
    }, [jobsData]);

    // Filter and sort logic for Browse Jobs
    const filteredBrowseJobs = useMemo(() => {
        let filtered = allBrowseJobs.filter((job: TransformedJob) => {
            // Search filter (already handled by API, but keep for location filtering)
            const matchesSearch = searchQuery === '' || 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Location filter
            const matchesLocation = locationFilter === '' || 
                job.location.toLowerCase().includes(locationFilter.toLowerCase());
            
            // Job type filter (case-insensitive)
            const matchesJobType = jobTypeFilter === '' || 
                jobTypeFilter === 'Job Type' ||
                job.type.toLowerCase() === jobTypeFilter.toLowerCase();
            
            return matchesSearch && matchesLocation && matchesJobType;
        });

        // Sort logic
        switch (sortOption) {
            case 'Newest First':
                filtered = filtered.sort((a: TransformedJob, b: TransformedJob) => (b.createdAt || 0) - (a.createdAt || 0));
                break;
            case 'Oldest First':
                filtered = filtered.sort((a: TransformedJob, b: TransformedJob) => (a.createdAt || 0) - (b.createdAt || 0));
                break;
            case 'Budget: High to Low':
                filtered = filtered.sort((a: TransformedJob, b: TransformedJob) => (b.budgetMax || 0) - (a.budgetMax || 0));
                break;
            case 'Budget: Low to High':
                filtered = filtered.sort((a: TransformedJob, b: TransformedJob) => (a.budgetMin || 0) - (b.budgetMin || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [searchQuery, locationFilter, jobTypeFilter, sortOption, allBrowseJobs]);

    // Filter and sort logic for My Jobs
    const filteredMyJobs = useMemo(() => {
        let filtered = allMyJobs.filter((job: TransformedMyJob) => {
            // Search filter (already handled by API, but keep for location filtering)
            const matchesSearch = searchQuery === '' || 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Location filter
            const matchesLocation = locationFilter === '' || 
                job.location.toLowerCase().includes(locationFilter.toLowerCase());
            
            // Job type filter (case-insensitive)
            const matchesJobType = jobTypeFilter === '' || 
                jobTypeFilter === 'Job Type' ||
                job.type.toLowerCase() === jobTypeFilter.toLowerCase();
            
            return matchesSearch && matchesLocation && matchesJobType;
        });

        // Sort logic
        switch (sortOption) {
            case 'Newest First':
                filtered = filtered.sort((a: TransformedMyJob, b: TransformedMyJob) => (b.createdAt || 0) - (a.createdAt || 0));
                break;
            case 'Oldest First':
                filtered = filtered.sort((a: TransformedMyJob, b: TransformedMyJob) => (a.createdAt || 0) - (b.createdAt || 0));
                break;
            case 'Budget: High to Low':
                filtered = filtered.sort((a: TransformedMyJob, b: TransformedMyJob) => (b.budgetMax || 0) - (a.budgetMax || 0));
                break;
            case 'Budget: Low to High':
                filtered = filtered.sort((a: TransformedMyJob, b: TransformedMyJob) => (a.budgetMin || 0) - (b.budgetMin || 0));
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
                <BrowseJobsContent jobs={filteredBrowseJobs} isLoading={isLoading} />
            ) : (
                <MyJobsContent jobs={filteredMyJobs} isLoading={isLoading} />
            )}
        </div>
    );
};

export default BrowsJobsOverview;