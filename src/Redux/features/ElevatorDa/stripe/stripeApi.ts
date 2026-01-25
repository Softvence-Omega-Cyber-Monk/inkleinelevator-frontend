import { baseApi } from "../../../api/baseApi";

interface ActiveStripeAccountResponse {
  url: string;
}

interface ConnectAccountActivationCheckResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
  };
}

interface OnboardingLinkResponse {
  success: boolean;
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

    // Check Stripe Connect Account Activation Status
    checkConnectAccountActivation: builder.mutation<
      ConnectAccountActivationCheckResponse,
      void
    >({
      query: () => ({
        url: "/payment/stripe/connectacount-activation-check",
        method: "POST",
      }),
    }),

    // Get Stripe Onboarding Link
    getOnboardingLink: builder.mutation<OnboardingLinkResponse, void>({
      query: () => ({
        url: "/payment/stripe/onboarding-link",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useActiveStripeAccountMutation,
  useCheckConnectAccountActivationMutation,
  useGetOnboardingLinkMutation,
} = stripeApi;
