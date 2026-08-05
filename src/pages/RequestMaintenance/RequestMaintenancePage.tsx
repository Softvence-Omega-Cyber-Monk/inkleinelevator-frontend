import React, { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Layers,
  Wrench,
  Calendar,
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  Briefcase,
} from "lucide-react";

export default function RequestMaintenancePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    buildingAddress: "",
    buildingType: "Office Building",
    numberOfElevators: 1,
    elevatorManufacturer: "",
    elevatorType: "Passenger Elevator",
    approximateAge: "",
    currentProvider: "",
    contractExpirationDate: "",
    desiredStartDate: "",
    additionalNotes: "",
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfElevators" ? Number(value) : value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Please enter your Company / Building Name.");
      return;
    }
    if (!formData.contactName.trim()) {
      toast.error("Please enter your Contact Name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your Email Address.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your Phone Number.");
      return;
    }
    if (!formData.buildingAddress.trim()) {
      toast.error("Please enter your Building Address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      toast.success("Maintenance Request submitted successfully!");
    }, 800);
  };

  if (submitted) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Request Received!
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            Thank you for requesting an elevator maintenance contract evaluation for{" "}
            <span className="font-semibold text-gray-800">
              {formData.companyName}
            </span>
            . Our team will personally review your information and reach out shortly to obtain tailored maintenance proposals for your facility.
          </p>

          <div className="bg-gray-50 p-5 rounded-2xl text-left border border-gray-200 mb-8 space-y-2 text-sm text-gray-600">
            <p>
              <strong className="text-gray-800">Contact Person:</strong> {formData.contactName} ({formData.email})
            </p>
            <p>
              <strong className="text-gray-800">Facility Type:</strong> {formData.buildingType} ({formData.numberOfElevators} elevator{formData.numberOfElevators > 1 ? "s" : ""})
            </p>
            <p>
              <strong className="text-gray-800">Building Address:</strong> {formData.buildingAddress}
            </p>
            {files.length > 0 && (
              <p>
                <strong className="text-gray-800">Attachments:</strong> {files.length} document(s) uploaded
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                companyName: "",
                contactName: "",
                email: "",
                phone: "",
                buildingAddress: "",
                buildingType: "Office Building",
                numberOfElevators: 1,
                elevatorManufacturer: "",
                elevatorType: "Passenger Elevator",
                approximateAge: "",
                currentProvider: "",
                contractExpirationDate: "",
                desiredStartDate: "",
                additionalNotes: "",
              });
              setFiles([]);
            }}
            className="w-full py-3.5 px-6 bg-[#0A1A3A] hover:bg-teal-500 text-white hover:text-[#0A1A3A] font-semibold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Submit Another Maintenance Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Page Banner Matching Site Aesthetics (AboutBanner) */}
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl">
          {/* Decorative SVG Icons */}
          <div className="absolute top-8 right-8 text-cyan-400 opacity-40 hidden sm:block">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div className="absolute left-8 top-1/4 text-cyan-400 opacity-40 hidden sm:block">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 0H9m3 0h3" />
            </svg>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Request Elevator Maintenance Contract
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              Looking for an elevator maintenance contract for your building, hotel, hospital, or commercial facility? Fill out the evaluation form below and receive tailored maintenance proposals.
            </p>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 border border-cyan-400 rounded-full"></div>
          </div>
        </div>

        {/* Form Container with 2-Column Responsive Grid Layout */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* CARD 1: Company & Contact Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8 space-y-6 h-full">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    1. Company & Contact Information
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Basic details about your organization and primary contact
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Company/Building Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Company / Building Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building2 size={18} />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Grand Plaza Hotel"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Contact Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sarah@grandplaza.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. (555) 234-5678"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Building & Elevator Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8 space-y-6 h-full">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Building size={22} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    2. Building & Elevator Details
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Information about your facility and elevator equipment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Building Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Building Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="buildingAddress"
                      value={formData.buildingAddress}
                      onChange={handleChange}
                      placeholder="e.g. 123 Main St, Suite 400, New York, NY 10001"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Building Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Building Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                    required
                  >
                    <option value="Office Building">Office Building</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment / Residential">
                      Apartment / Residential
                    </option>
                    <option value="Hospital / Healthcare">
                      Hospital / Healthcare
                    </option>
                    <option value="School / University">
                      School / University
                    </option>
                    <option value="Retail / Commercial">
                      Retail / Commercial
                    </option>
                    <option value="Industrial / Warehouse">
                      Industrial / Warehouse
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Number of Elevators */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Number of Elevators <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Layers size={18} />
                    </div>
                    <input
                      type="number"
                      name="numberOfElevators"
                      min={1}
                      value={formData.numberOfElevators}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Elevator Manufacturer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Elevator Manufacturer{" "}
                    <span className="text-gray-400 font-normal">(If known)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Wrench size={18} />
                    </div>
                    <input
                      type="text"
                      name="elevatorManufacturer"
                      value={formData.elevatorManufacturer}
                      onChange={handleChange}
                      placeholder="e.g. Otis, Schindler, Kone, Thyssenkrupp"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Elevator Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Elevator Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="elevatorType"
                    value={formData.elevatorType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                    required
                  >
                    <option value="Passenger Elevator">Passenger Elevator</option>
                    <option value="Freight Elevator">Freight Elevator</option>
                    <option value="Service Elevator">Service Elevator</option>
                    <option value="Hydraulic Elevator">Hydraulic Elevator</option>
                    <option value="Traction Elevator">Traction Elevator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Approximate Age of Elevators */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Approximate Age of Elevators
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Clock size={18} />
                    </div>
                    <input
                      type="text"
                      name="approximateAge"
                      value={formData.approximateAge}
                      onChange={handleChange}
                      placeholder="e.g. 5 years, 12 years old, Modernized in 2021"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Current Contract & Schedule */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8 space-y-6 h-full">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Calendar size={22} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    3. Current Contract & Schedule
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Existing maintenance terms and desired start dates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Current Maintenance Provider */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Current Maintenance Provider{" "}
                    <span className="text-gray-400 font-normal">(If applicable)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Briefcase size={18} />
                    </div>
                    <input
                      type="text"
                      name="currentProvider"
                      value={formData.currentProvider}
                      onChange={handleChange}
                      placeholder="e.g. Current service vendor name"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Current Contract Expiration Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Current Expiration Date{" "}
                    <span className="text-gray-400 font-normal">(If known)</span>
                  </label>
                  <input
                    type="date"
                    name="contractExpirationDate"
                    value={formData.contractExpirationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                  />
                </div>

                {/* Desired Start Date for New Contract */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Desired Start Date
                  </label>
                  <input
                    type="date"
                    name="desiredStartDate"
                    value={formData.desiredStartDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* CARD 4: Additional Notes & Attachments */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8 space-y-6 h-full">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    4. Additional Notes & Attachments
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Specific requirements, issues, photos, or existing contracts
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Additional Notes or Special Concerns
                </label>
                <textarea
                  name="additionalNotes"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Provide any specific details, maintenance history, equipment issues, or special requests..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none text-gray-900 text-sm transition-all"
                />
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Upload Documents or Photos{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <label className="w-full px-4 py-6 bg-blue-50/60 border-2 border-dashed border-blue-200 hover:border-teal-400 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                  <div className="p-2.5 bg-white rounded-full shadow-xs text-teal-600 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-gray-800 text-sm">
                      Click to upload
                    </span>{" "}
                    <span className="text-gray-500 text-sm">or drag and drop</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      PDF, DOC, DOCX, PNG, JPG (up to 10MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Selected Files ({files.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs"
                        >
                          <FileText size={15} className="text-teal-600" />
                          <span className="text-xs font-medium text-gray-700 max-w-[160px] truncate">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Note & Submit Button */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-600">
              <ShieldCheck size={20} className="text-teal-600 shrink-0 mt-0.5" />
              <p>
                Your maintenance request will be reviewed personally by our team. Information is confidential and will only be shared with verified elevator maintenance companies upon evaluation.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#0A1A3A] hover:bg-teal-500 text-white hover:text-[#0A1A3A] font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Maintenance Request"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
