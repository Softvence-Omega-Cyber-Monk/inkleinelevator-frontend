import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, MapPin, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import QuickBidModal from "@/components/ElevatorAllMdal/QuickBidModal"
import { useGetSingleJobByIdQuery } from "@/Redux/features/userDa/userJob/userJobApi"

export default function ElevatorMyJobDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quickBidModalOpen, setQuickBidModalOpen] = useState(false)

  // Fetch job data using API
  const { data: jobResponse, isLoading, isError } = useGetSingleJobByIdQuery(id || '', {
    skip: !id,
  })

  // Transform API response to match component structure
  const jobData = useMemo(() => {
    if (!jobResponse?.data) return null;

    const job = jobResponse.data;
    
    // Parse budget range (format: "6300-3594")
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

    const budget = parseBudget(job.estimitedBudget || '');
    const locationParts = [
      job.streetAddress,
      job.address,
      job.city,
      job.zipCode
    ].filter(Boolean);
    const fullLocation = locationParts.join(', ') || job.address || '';

    // Strip HTML from description
    const stripHtml = (html: string) => {
      if (!html) return '';
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    return {
      id: job.jobId,
      title: job.jobTitle || '',
      type: job.jobType ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).toLowerCase() : '',
      postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '',
      location: {
        address: fullLocation
      },
      budget: budget,
      description: stripHtml(job.projectDescription || ''),
      tasks: [], // API doesn't provide tasks, can be empty or parsed from description
      technicalRequirements: job.technicalRequermentAndCertification || [],
      elevatorSpecifications: {
        type: job.elevatorType || '',
        numberOfUnits: job.numberOfElevator || 0,
        capacity: job.capasity || '',
        speed: job.speed || ''
      },
      photos: (job.photo || []).map((url: string, index: number) => ({
        url: url,
        name: `Photo ${index + 1}`
      })),
      documents: (job.documents || []).map((url: string, index: number) => ({
        url: url,
        name: `Document ${index + 1}`
      })),
      contactInfo: {
        company: '', // API doesn't provide this
        contact: '', // API doesn't provide this
        phone: '' // API doesn't provide this
      }
    };
  }, [jobResponse]);

  const projectImages = useMemo(() => {
    return jobData?.photos?.map((photo: { url: string }) => photo.url) || [];
  }, [jobData]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length)
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading job details...</div>
      </main>
    );
  }

  // Error state
  if (isError || !jobData) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Failed to load job details. Please try again.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{jobData.title}</h1>
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                  {jobData.type}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-600">
                <span className="text-gray-500">Posted {jobData.postedDate}</span>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{jobData.location.address}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget: {jobData.budget.display}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      {projectImages.length > 0 ? (
        <section className="relative h-64 md:h-80 lg:h-96 bg-gray-900 overflow-hidden">
          <img
            src={projectImages[currentImageIndex] || "/placeholder.svg"}
            alt={`Project image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {projectImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </section>
      ) : (
        <section className="relative h-64 md:h-80 lg:h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Project Description */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            {jobData.description}
          </p>
              {jobData.tasks && jobData.tasks.length > 0 ? (
            <ul className="space-y-2 text-gray-600 text-sm md:text-base ml-4">
              {jobData.tasks.map((task, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-gray-400">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No specific tasks listed</p>
          )}
        </section>

        {/* Technical Requirements */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Technical Requirements</h2>
          {jobData.technicalRequirements && jobData.technicalRequirements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {jobData.technicalRequirements.map((requirement: string, index: number) => (
                <Card key={index} className="bg-gray-50 border-gray-200 p-4 text-center">
                  <p className="text-xs md:text-sm font-semibold text-gray-700">{requirement}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No technical requirements listed</p>
          )}
        </section>

        {/* Elevator Specifications */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Elevator Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Elevator Type</p>
              <p className="text-gray-900 font-semibold">{jobData.elevatorSpecifications.type}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Number of Units</p>
              <p className="text-gray-900 font-semibold">{jobData.elevatorSpecifications.numberOfUnits} Elevators</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Capacity</p>
              <p className="text-gray-900 font-semibold">{jobData.elevatorSpecifications.capacity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Speed</p>
              <p className="text-gray-900 font-semibold">{jobData.elevatorSpecifications.speed}</p>
            </div>
          </div>
        </section>

        {/* Uploaded Photos */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Uploaded Photos</h2>
          {jobData.photos && jobData.photos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jobData.photos.map((photo: { url: string; name: string }, index: number) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {jobData.photos.map((photo: { url: string; name: string }, index: number) => (
                  <p key={index} className={index === 0 ? "font-semibold text-gray-700" : ""}>{photo.name}</p>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">No photos uploaded</p>
          )}
        </section>

        {/* Uploaded Documents */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Uploaded Documents</h2>
          {jobData.documents && jobData.documents.length > 0 ? (
            <div className="space-y-3">
              {jobData.documents.map((doc: { url: string; name: string }, index: number) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{doc.name}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No documents uploaded</p>
          )}
        </section>

        {/* Contact Information */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3 text-sm md:text-base text-gray-700">
            {jobData.contactInfo.company ? (
              <div>
                <p className="font-semibold text-gray-900">{jobData.contactInfo.company}</p>
              </div>
            ) : null}
            {jobData.contactInfo.contact ? (
              <div>
                <p className="text-gray-600">Contact: {jobData.contactInfo.contact}</p>
              </div>
            ) : null}
            {jobData.contactInfo.phone ? (
              <div>
                <p className="text-gray-600">Phone: {jobData.contactInfo.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Contact information not available</p>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            onClick={() => navigate('/elevator')}
          >
            Back
          </Button>
          <Button 
            className="bg-gray-900 hover:bg-gray-800 text-white"
            onClick={() => setQuickBidModalOpen(true)}
          >
            Quick Bid
          </Button>
        </div>
      </div>

      {/* Quick Bid Modal */}
      {jobData && (
        <QuickBidModal
          isOpen={quickBidModalOpen}
          onClose={() => setQuickBidModalOpen(false)}
          jobId={jobData.id}
          jobTitle={jobData.title}
          budgetMin={jobData.budget.min}
          budgetMax={jobData.budget.max}
        />
      )}
    </main>
  )
}
