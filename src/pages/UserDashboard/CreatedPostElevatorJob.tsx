import BasicsStep from "@/components/createdJobFromStep/BasicsStep";
import DetailsStep from "@/components/createdJobFromStep/DetailsStep";
import LocationStep from "@/components/createdJobFromStep/LocationStep";
import ReviewStep from "@/components/createdJobFromStep/ReviewStep";
import StepperHeader from "@/components/createdJobFromStep/StepperHeader";
import UploadDocumentsStep from "@/components/createdJobFromStep/UploadDocumentsStep";
import { useCreateNewJobMutation, useGetSingleJobByIdQuery, useUpdateJobMutation } from "@/Redux/features/userDa/userJob/userJobApi";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreatedPostElevatorJob() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const isEditMode = !!jobId;

  const [createNewJob, { isLoading: isCreating }] = useCreateNewJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const { data: jobData, isLoading: isLoadingJob } = useGetSingleJobByIdQuery(jobId || "", {
    skip: !jobId,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    jobTitle: "",
    serviceType: "",
    description: "",
    technicalRequirements: [],
    elevatorType: "",
    numberOfElevators: "",
    capacity: "",
    speed: "",
    address: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    photos: [],
    documents: [],
    estimatedBudget: "",
  });

  // Load job data when in edit mode
  useEffect(() => {
    if (isEditMode && jobData?.data) {
      const job = jobData.data;
      setFormData({
        jobTitle: job.jobTitle || "",
        serviceType: job.jobType || "",
        description: job.projectDescription || "",
        technicalRequirements: (job.technicalRequermentAndCertification || []).map((req: any) => String(req || "").trim()).filter((req: string) => req),
        elevatorType: job.elevatorType || "",
        numberOfElevators: String(job.numberOfElevator || ""),
        capacity: job.capasity || "",
        speed: job.speed || "",
        address: job.address || "",
        streetAddress: job.streetAddress || "",
        city: job.city || "",
        zipCode: job.zipCode || "",
        photos: job.photo?.map((url: string, index: number) => ({
          id: `photo-${index}`,
          url: url,
          isExisting: true,
        })) || [],
        documents: job.documents?.map((url: string, index: number) => ({
          id: `doc-${index}`,
          url: url,
          name: url.split("/").pop() || `document-${index}`,
          isExisting: true,
        })) || [],
        estimatedBudget: job.estimitedBudget || "",
      });
    }
  }, [isEditMode, jobData]);

  const isLoading = isCreating || isUpdating;

  const steps = ["Basics", "Details", "Location", "Upload Documents", "Review"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.jobTitle?.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!formData.serviceType) {
      toast.error("Service type is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Project description is required");
      return;
    }

    // Ensure technicalRequirements is an array of strings
    const technicalRequirements = Array.isArray(formData.technicalRequirements)
      ? formData.technicalRequirements.map((item: any) => String(item || "").trim()).filter((item: string) => item)
      : [];

    const form = new FormData();

    // ===== TEXT & NUMBER FIELDS =====
    form.append("jobTitle", formData.jobTitle.trim());
    form.append("jobType", formData.serviceType);
    form.append("projectDescription", formData.description.trim());
    
    // Only append fields that have values (avoid empty strings)
    if (formData.elevatorType) {
      form.append("elevatorType", formData.elevatorType);
    }
    if (formData.numberOfElevators) {
      form.append("numberOfElevator", String(formData.numberOfElevators));
    }
    if (formData.capacity) {
      form.append("capacity", String(formData.capacity));
    }
    if (formData.speed) {
      form.append("speed", String(formData.speed));
    }
    if (formData.address) {
      form.append("address", formData.address);
    }
    if (formData.streetAddress) {
      form.append("streetAddress", formData.streetAddress);
    }
    if (formData.city) {
      form.append("city", formData.city);
    }
    if (formData.zipCode) {
      form.append("zipCode", formData.zipCode);
    }
    if (formData.estimatedBudget) {
      form.append("estimatedBudget", formData.estimatedBudget);
    }

    if (isEditMode && jobId) {
      // ===== UPDATE MODE: Handle existing and new files separately =====
      
      // Separate existing photos from new photos
      const existingPhotos: string[] = [];
      const newPhotos: File[] = [];
      
      formData.photos?.forEach((file: any) => {
        if (file.isExisting && file.url) {
          existingPhotos.push(file.url);
        } else if (file instanceof File) {
          newPhotos.push(file);
        }
      });

      // Append existing photos URLs
      existingPhotos.forEach((url) => {
        form.append("existingPhotos", url);
      });

      // Append new photo files
      newPhotos.forEach((file) => {
        form.append("photos", file, file.name);
      });

      // Separate existing documents from new documents
      const existingDocuments: string[] = [];
      const newDocuments: File[] = [];
      
      formData.documents?.forEach((doc: any) => {
        if (doc.isExisting && doc.url) {
          existingDocuments.push(doc.url);
        } else if (doc.file instanceof File) {
          newDocuments.push(doc.file);
        }
      });

      // Append existing documents URLs
      existingDocuments.forEach((url) => {
        form.append("existingDocuments", url);
      });

      // Append new document files
      newDocuments.forEach((file) => {
        form.append("documents", file, file.name);
      });

      // Handle technical requirements - separate existing from new
      const existingTechReqs: string[] = [];
      const newTechReqs: string[] = [];
      
      // Use the validated technicalRequirements array
      technicalRequirements.forEach((stringValue: string) => {
        // Check if it's an existing requirement (from API) or new
        // For now, treat all as new since we don't have a way to distinguish
        newTechReqs.push(stringValue);
      });

      // Append existing technical requirements
      existingTechReqs.forEach((req) => {
        const stringValue = String(req || "").trim();
        if (stringValue) {
          form.append("existingTechnicalRequirementsAndCertifications", stringValue);
        }
      });

      // Append new technical requirements
      newTechReqs.forEach((req) => {
        const stringValue = String(req || "").trim();
        if (stringValue) {
          form.append("technicalRequirementsAndCertifications", stringValue);
        }
      });
    } else {
      // ===== CREATE MODE: Only new files =====
      
      // Technical requirements - use the validated array
      technicalRequirements.forEach((stringValue: string) => {
        form.append("technicalRequirementsAndCertifications", stringValue);
      });

      // New photos
      formData.photos?.forEach((file: any) => {
        if (file instanceof File) {
          form.append("photos", file, file.name);
        }
      });

      // New documents
      formData.documents?.forEach((doc: any) => {
        if (doc.file instanceof File) {
          form.append("documents", doc.file, doc.name);
        }
      });
    }
    
    // ===== SUBMIT FORM =====
    try {
      if (isEditMode && jobId) {
        await updateJob({ jobId, formData: form }).unwrap();
        toast.success("Job updated successfully");
        navigate(`/user/my-jobs-details/${jobId}`);
      } else {
        await createNewJob(form).unwrap();
        toast.success("Job created successfully");
        navigate("/user");
      }
    } catch (err: any) {
      console.error(isEditMode ? "Update job failed" : "Create job failed", err);
      const errorMessage = err?.data?.message || err?.data?.error || err?.message || (isEditMode ? "Failed to update job" : "Failed to create job");
      toast.error(errorMessage);
      
      // Log full error details for debugging
      if (err?.data) {
        console.error("Error details:", err.data);
      }
      if (err?.status) {
        console.error("Error status:", err.status);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicsStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <DetailsStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <UploadDocumentsStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={isLoading}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">
              {isEditMode ? "Edit Job" : "Post a New Job"}
            </h1>
            <p className="text-[#717182] mt-2 text-base">
              {isEditMode 
                ? "Update your job details below." 
                : "Describe your project to find the perfect professional."}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="p-6">
        {isLoadingJob ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading job data...</p>
          </div>
        ) : (
          <>
            <StepperHeader currentStep={currentStep} steps={steps} />
            {/* Content */}
            <div className="mt-8">{renderStep()}</div>
          </>
        )}
      </div>
    </div>
  );
}
