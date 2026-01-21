import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, MapPin, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { jobDetailsData } from "@/data/jobDetails"
import BidSubmissionSuccessModal from "@/components/ElevatorAllMdal/BidSubmissionSuccessModal"
import { toast } from "sonner"

interface BidFormData {
  bidAmount: string;
  completionTimeline: string;
  briefProposal: string;
}

export default function ElevatorJobDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BidFormData>()

  // Use JSON data - in production, fetch by ID
  const jobData = jobDetailsData.jobDetails
  const projectImages = jobData.photos.map(photo => photo.url)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length)
  }

  const formatBudget = (min: number, max: number) => {
    const minFormatted = (min / 1000).toFixed(0) + "k"
    const maxFormatted = (max / 1000).toFixed(0) + "k"
    return `$${minFormatted} - $${maxFormatted}`
  }

  const onSubmitBid = async (data: BidFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Add API call here when backend is ready
      // await submitBid({ jobId: id, ...data })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      reset()
      setShowSuccessModal(true)
    } catch (error) {
      toast.error("Failed to submit bid. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
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
      <section className="relative h-64 md:h-80 lg:h-96 bg-gray-900 overflow-hidden">
        <img
          src={projectImages[currentImageIndex] || "/placeholder.svg"}
          alt={`Project image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
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
      </section>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Job Details */}
          <div>
            {/* Project Description */}
            <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            {jobData.description}
          </p>
          <ul className="space-y-2 text-gray-600 text-sm md:text-base ml-4">
            {jobData.tasks.map((task, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-gray-400">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Requirements */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Technical Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {jobData.technicalRequirements.map((requirement, index) => (
              <Card key={index} className="bg-gray-50 border-gray-200 p-4 text-center">
                <p className="text-xs md:text-sm font-semibold text-gray-700">{requirement}</p>
              </Card>
            ))}
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jobData.photos.map((photo, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {jobData.photos.map((photo, index) => (
              <p key={index} className={index === 0 ? "font-semibold text-gray-700" : ""}>{photo.name}</p>
            ))}
          </div>
        </section>

        {/* Uploaded Documents */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Uploaded Documents</h2>
          <div className="space-y-3">
            {jobData.documents.map((doc, index) => (
              <label key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" defaultChecked={index === 0} className="w-4 h-4" />
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{doc.name}</span>
              </label>
            ))}
          </div>
        </section>

            {/* Contact Information */}
            <section className="mb-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3 text-sm md:text-base text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">{jobData.contactInfo.company}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contact: {jobData.contactInfo.contact}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone: {jobData.contactInfo.phone}</p>
                </div>
              </div>
            </section>

            {/* Back Button */}
            <div className="mb-8">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={() => navigate('/elevator/browse-jobs')}
              >
                Back
              </Button>
            </div>
          </div>

          {/* Right Column - Submit Your Bid Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Submit Your Bid
                </h2>
                <p className="text-sm text-gray-500">
                  Provide your proposal details for this project
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-5">
                {/* Bid Amount */}
                <div>
                  <label
                    htmlFor="bidAmount"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Bid Amount ($)
                  </label>
                  <input
                    type="text"
                    id="bidAmount"
                    placeholder="Enter your bid amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    {...register("bidAmount", {
                      required: "Bid amount is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Please enter a valid amount",
                      },
                      validate: (value) => {
                        const numValue = parseFloat(value);
                        if (numValue < jobData.budget.min || numValue > jobData.budget.max) {
                          return `Bid must be between ${formatBudget(jobData.budget.min, jobData.budget.max)}`;
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.bidAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bidAmount.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Budget range: {formatBudget(jobData.budget.min, jobData.budget.max)}
                  </p>
                </div>

                {/* Completion Timeline */}
                <div>
                  <label
                    htmlFor="completionTimeline"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Completion Timeline
                  </label>
                  <input
                    type="text"
                    id="completionTimeline"
                    placeholder="e.g., 8-10 weeks"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    {...register("completionTimeline", {
                      required: "Completion timeline is required",
                    })}
                  />
                  {errors.completionTimeline && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.completionTimeline.message}
                    </p>
                  )}
                </div>

                {/* Brief Proposal */}
                <div>
                  <label
                    htmlFor="briefProposal"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Brief Proposal
                  </label>
                  <textarea
                    id="briefProposal"
                    rows={4}
                    placeholder="Briefly describe your approach and experience..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
                    {...register("briefProposal", {
                      required: "Brief proposal is required",
                      minLength: {
                        value: 50,
                        message: "Proposal must be at least 50 characters",
                      },
                    })}
                  />
                  {errors.briefProposal && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.briefProposal.message}
                    </p>
                  )}
                </div>

                {/* Confirmation Message */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-900">
                    By submitting this bid, you confirm that you meet all the
                    requirements listed and can complete the project as specified.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Bid"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <BidSubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </main>
  )
}
