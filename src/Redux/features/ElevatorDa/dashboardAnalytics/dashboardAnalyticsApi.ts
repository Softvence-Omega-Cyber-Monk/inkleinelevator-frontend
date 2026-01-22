import { baseApi } from "@/Redux/api/baseApi";

interface DashboardAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    totalBid: number;
    jobCount: number;
    userRatingResult: {
      _avg: {
        rating: number | null;
      };
    };
    totalRevenew: number;
  };
}

const dashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard analytics
    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, void>({
      query: () => ({
        url: "/user/dashboardAnalytics",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardAnalyticsApi;
