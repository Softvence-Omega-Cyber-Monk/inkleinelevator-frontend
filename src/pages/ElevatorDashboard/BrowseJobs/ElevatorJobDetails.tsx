import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, MapPin, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import QuickBidModal from "@/components/ElevatorAllMdal/QuickBidModal"
import { jobDetailsData } from "@/data/jobDetails"

export default function ElevatorJobDetails() {
  const { id } = useParams<{ id: string }>()
  console.log(id)
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quickBidModalOpen, setQuickBidModalOpen] = useState(false)

  // Use JSON data - in production, fetch by ID
  const jobData = jobDetailsData.getJobById(id || 1) || jobDetailsData.jobs[0]
  const projectImages = jobData.photos.map(photo => photo.url)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length)
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
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
      <QuickBidModal
        isOpen={quickBidModalOpen}
        onClose={() => setQuickBidModalOpen(false)}
        jobId={jobData.id}
        jobTitle={jobData.title}
        budgetMin={jobData.budget.min}
        budgetMax={jobData.budget.max}
      />
    </main>
  )
}
