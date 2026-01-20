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
    getAllCategoryFee: builder.query({
      query: () => ({
        url: "/job/get-all-job",
        method: "GET",
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
  }),
});

export const { useCreateNewJobMutation, useGetAllMyJobsQuery } = userJobApi;
