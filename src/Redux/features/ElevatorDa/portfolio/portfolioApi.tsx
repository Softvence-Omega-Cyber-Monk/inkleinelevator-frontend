import { baseApi } from "@/Redux/api/baseApi";

const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all active jobs for elevator
    getElevatorPortfolio: builder.query({
      query: () => ({
        url: "/protfolio",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetElevatorPortfolioQuery } = portfolioApi;