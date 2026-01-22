import { baseApi } from "@/Redux/api/baseApi";

const paymentBidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSingleJobPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/singlejob/payment/checkout",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateSingleJobPaymentMutation } = paymentBidApi;
