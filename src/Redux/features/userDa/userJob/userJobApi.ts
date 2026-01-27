import { baseApi } from "@/Redux/api/baseApi";

const userJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create new job
    createNewJob: builder.mutation({
      query: (formData) => ({
        url: "/job/createJob",
        method: "POST",
        body: formData,
      }),
    }),

    // Get all jobs
    getAllJobs: builder.query({
      query: ({ page = 1, limit = 10, search, jobType }) => ({
        url: "/job/get-all-job",
        method: "GET",
        params: { page, limit, search, jobType },
      }),
    }),

    // Get all my jobs
    getAllMyJobs: builder.query({
      query: ({ page = 1, limit = 10, search, jobType }) => ({
        url: "/job/get-myJob",
        method: "GET",
        params: { page, limit, search, jobType },
      }),
    }),

    // Get single job by id
    getSingleJobById: builder.query({
      query: (jobId: string) => ({
        url: `/job/get-single-job/${jobId}`,
        method: "GET",
      }),
    }),

    // Get all active jobs for user dashboard
    getAllActiveJobsUserDashboard: builder.query({
      query: () => ({
        url: "/user/get-my-all-active-jobs",
        method: "GET",
      }),
    }),

    // Close job
    closeJob: builder.mutation<any, string>({
      query: (jobId) => ({
        url: `/job/close-Job?jobId=${jobId}`,
        method: "POST",
      }),
    }),

    // Complete job
    completeJob: builder.mutation({
      query: (jobId: string) => ({
        url: `/job/jobs/${jobId}/complete`,
        method: "PATCH",
      }),
    }),

    // Request job
    requestJobStatus: builder.mutation({
      query: (jobId: number | string) => ({
        url: `/job/jobs/${jobId}/ready-for-review`,
        method: "PATCH",
      }),
    }),

    // Reject job
    reject: builder.mutation({
      query: (jobId: string) => ({
        url: `/job/jobs/${jobId}/cancel-ready-for-review`, // fixed typo: cancle → cancel
        method: "PATCH",
      }),
    }),

    // Delete job
    deleteJob: builder.mutation({
      query: (jobId: string) => ({
        url: `/job/job/delete/${jobId}`,
        method: "DELETE",
      }),
    }),

    // Update job - PATCH /job/updateJob/{jobId}
    updateJob: builder.mutation({
      query: ({ jobId, formData }: { jobId: string; formData: FormData }) => ({
        url: `/job/updateJob/${jobId}`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateNewJobMutation,
  useGetAllJobsQuery,
  useGetAllMyJobsQuery,
  useGetSingleJobByIdQuery,
  useGetAllActiveJobsUserDashboardQuery,
  useCloseJobMutation,
  useCompleteJobMutation,
  useRequestJobStatusMutation,
  useRejectMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} = userJobApi;
