import { baseApi } from "@/Redux/api/baseApi";

const userDashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardAnalytics: builder.query({
      query: () => ({
        url: `/user/userDashboardAnalytics`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserDashboardAnalyticsQuery } = userDashboardAnalyticsApi;
