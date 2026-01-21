import { baseApi } from "@/Redux/api/baseApi";

// interface ActiveJob {
//   jobId: string;
//   jobTitle: string;
//   jobType: string;
//   projectDescription: string;
//   address?: string;
//   streetAddress?: string;
//   city?: string;
//   zipCode?: string;
//   estimitedBudget?: string;
//   [key: string]: any;
// }

// interface GetElevatorActiveJobsResponse {
//   success: boolean;
//   message: string;
//   data: ActiveJob[];
// }

const elevatorJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all active jobs for elevator
    getElevatorAllActiveJobs: builder.query({
      query: () => ({
        url: "/user/get-elevator-all-active-jobs",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetElevatorAllActiveJobsQuery } = elevatorJobApi;
