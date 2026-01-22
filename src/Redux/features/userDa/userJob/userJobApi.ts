import { baseApi } from "@/Redux/api/baseApi";

const userJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewJob: builder.mutation({
      query: (formData) => ({
        url: "/job/createJob", // endpoint from your swagger
        method: "POST",
        body: formData,
      }),
    }),
    // get all job data data

    getAllJobs: builder.query({
      query: ({ page = 1, limit = 10, search, jobType }) => ({
        url: "/job/get-all-job",
        method: "GET",
        params: {
          page,
          limit,
          search, // optional
          jobType, // optional
        },
      }),
    }),
    // get all my job data
    getAllMyJobs: builder.query({
      query: ({ page = 1, limit = 10, search, jobType }) => ({
        url: "/job/get-myJob",
        method: "GET",
        params: {
          page,
          limit,
          search, // optional
          jobType, // optional
        },
      }),
    }),
    // get single job by id
    getSingleJobById: builder.query({
      query: (jobId) => ({
        url: `/job/get-single-job/${jobId}`,
        method: "GET",
      }),
    }),
    // /user/get-my-all-active-jobs  >> for user dashboard active jobs
    getAllActiveJobsUserDashboard: builder.query({
      query: () => ({
        url: `/user/get-my-all-active-jobs`,
        method: "GET",
      }),
    }),
    // close job
    closeJob: builder.mutation<any, string>({
      query: (jobId) => ({
        url: `/job/close-Job?jobId=${jobId}`,
        method: "POST",
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
} = userJobApi;
