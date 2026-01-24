import { baseApi } from "@/Redux/api/baseApi";

interface Payment {
  paymentId: string;
  amount: number;
  userId: string;
  releaseStatus: string;
  status: string;
  stripePaymentId: string;
  jobId: string;
  bidId: string;
  createdAt: string;
}

interface PaginationMeta {
  totalPage: number;
  page: number;
  limit: number;
}

interface GetAllPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    meta: PaginationMeta;
    data: Payment[];
  };
}

interface ReleasePaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all review payments (pending)
    getAllReviewPayment: builder.query<
      GetAllPaymentsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const params: Record<string, string | number> = {
          page: 1,
          limit: 10,
        };

        if (args?.page) params.page = args.page;
        if (args?.limit) params.limit = args.limit;

        return {
          url: "/payment/all-review-payment",
          method: "GET",
          params,
        };
      },
    }),

    // Get all released payments
    getAllReleasedPayment: builder.query<
      GetAllPaymentsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const params: Record<string, string | number> = {
          page: 1,
          limit: 10,
        };

        if (args?.page) params.page = args.page;
        if (args?.limit) params.limit = args.limit;

        return {
          url: "/payment/all-relesed-payment",
          method: "GET",
          params,
        };
      },
    }),

    // Release payment
    releasePayment: builder.mutation<ReleasePaymentResponse, string>({
      query: (paymentId) => ({
        url: `/payment/${paymentId}/release`,
        method: "POST",
      }),
    }),
    getAllAdminPaymentAnalytics: builder.query({
      query: () => ({
        url: "/user/get-all-admin-analytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllReviewPaymentQuery,
  useGetAllReleasedPaymentQuery,
  useReleasePaymentMutation,
  useGetAllAdminPaymentAnalyticsQuery,
} = paymentApi;
