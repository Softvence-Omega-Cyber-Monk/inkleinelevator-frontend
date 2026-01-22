import { baseApi } from "../../../api/baseApi";

interface ActiveStripeAccountResponse {
  url: string;
}

const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Active Stripe Account
    activeStripeAccount: builder.mutation<ActiveStripeAccountResponse, void>({
      query: () => ({
        url: "/auth/activeStripeAccount",
        method: "POST",
      }),
    }),
  }),
});

export const { useActiveStripeAccountMutation } = stripeApi;
