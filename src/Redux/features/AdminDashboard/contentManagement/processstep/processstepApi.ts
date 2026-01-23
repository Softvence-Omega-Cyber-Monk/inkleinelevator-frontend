import { baseApi } from "@/Redux/api/baseApi";

interface Step {
  id: string;
  title: string;
  description: string;
  sectionId: string;
}

interface ProcessStepSection {
  id: string;
  howToWorksKey: string;
  sectionLabel: string;
  sectionTitle: string;
  createdAt: string;
  updatedAt: string;
  steps: Step[];
}

interface GetProcessStepSectionResponse {
  success: boolean;
  message: string;
  data: ProcessStepSection;
}

interface CreateSectionRequest {
  sectionLabel: string;
  sectionTitle: string;
}

interface UpdateSectionRequest {
  sectionLabel: string;
  sectionTitle: string;
}

interface CreateStepRequest {
  title: string;
  description: string;
}

interface UpdateStepRequest {
  title: string;
  description: string;
}

const processStepApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get How It Works section with steps
    getProcessStepSection: builder.query<GetProcessStepSectionResponse, void>({
      query: () => ({
        url: "/content-management-process-step/section-retrived",
        method: "GET",
      }),
    }),

    // Create How It Works section (one-time)
    createProcessStepSection: builder.mutation<
      { success: boolean; message: string; data: ProcessStepSection },
      CreateSectionRequest
    >({
      query: (body) => ({
        url: "/content-management-process-step/section-create",
        method: "POST",
        body,
      }),
    }),

    // Update How It Works section
    updateProcessStepSection: builder.mutation<
      { success: boolean; message: string; data: ProcessStepSection },
      UpdateSectionRequest
    >({
      query: (body) => ({
        url: "/content-management-process-step/section-update",
        method: "PATCH",
        body,
      }),
    }),

    // Add a step
    createStep: builder.mutation<
      { success: boolean; message: string; data: Step },
      CreateStepRequest
    >({
      query: (body) => ({
        url: "/content-management-process-step/step",
        method: "POST",
        body,
      }),
    }),

    // Update a step
    updateStep: builder.mutation<
      { success: boolean; message: string; data: Step },
      { id: string; data: UpdateStepRequest }
    >({
      query: ({ id, data }) => ({
        url: `/content-management-process-step/step/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Delete a step
    deleteStep: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/content-management-process-step/step/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProcessStepSectionQuery,
  useCreateProcessStepSectionMutation,
  useUpdateProcessStepSectionMutation,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} = processStepApi;

export default processStepApi;
