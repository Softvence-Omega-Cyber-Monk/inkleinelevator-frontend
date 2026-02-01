import { baseApi } from "@/Redux/api/baseApi";

interface PortfolioQueryParams {
  page?: number;
  limit?: number;
}

const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getElevatorPortfolio: builder.query<any, PortfolioQueryParams | void>({
      query: (params) => ({
        url: "/protfolio",
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 5,
        },
      }),
    }),
  }),
});

export const { useGetElevatorPortfolioQuery } = portfolioApi;