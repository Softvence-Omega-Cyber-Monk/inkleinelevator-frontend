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
        technicalRequirements: job.technicalRequermentAndCertification || [],
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
    const form = new FormData();

    // ===== TEXT & NUMBER FIELDS =====
    form.append("jobTitle", formData.jobTitle.trim());
    form.append("jobType", formData.serviceType);
    form.append("projectDescription", formData.description);
    form.append("elevatorType", formData.elevatorType);
    form.append("numberOfElevator", String(formData.numberOfElevators)); // number → string
    form.append("capacity", String(formData.capacity)); // if numeric
    form.append("speed", String(formData.speed)); // if numeric
    form.append("address", formData.address);
    form.append("streetAddress", formData.streetAddress);
    form.append("city", formData.city);
    form.append("zipCode", formData.zipCode);
    form.append("estimatedBudget", formData.estimatedBudget);

    // ===== ARRAY OF STRINGS =====
    formData.technicalRequirements?.forEach((item) => {
      form.append("technicalRequirementsAndCertifications", item);
    });

    // ===== FILES =====
    formData.photos?.forEach((file: any) => {
      if (file instanceof File) {
        form.append("photos", file, file.name);
      }
    });

    formData.documents?.forEach((doc: any) => {
      if (doc.file instanceof File) {
        form.append("documents", doc.file, doc.name);
      }
    });
    
    // ===== SUBMIT FORM =====
    try {
      if (isEditMode && jobId) {
        const res = await updateJob({ jobId, formData: form }).unwrap();
        console.log("Job updated successfully", res);
        toast.success("Job updated successfully");
        navigate(`/user/my-jobs-details/${jobId}`);
      } else {
        const res = await createNewJob(form).unwrap();
        console.log("Job created successfully", res);
        toast.success("Job created successfully");
        navigate("/user");
      }
    } catch (err: any) {
      console.error(isEditMode ? "Update job failed" : "Create job failed", err);
      toast.error(err?.data?.message || (isEditMode ? "Failed to update job" : "Failed to create job"));
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
