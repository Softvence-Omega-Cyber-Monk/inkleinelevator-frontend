import { baseApi } from "@/Redux/api/baseApi";

const userRecentActivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAllRecentActivity: builder.query({
      query: () => ({
        url: `/user/get-my-all-recent-activity`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserAllRecentActivityQuery } = userRecentActivityApi;
