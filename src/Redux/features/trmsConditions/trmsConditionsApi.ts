import { baseApi } from "@/Redux/api/baseApi";

const termsConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userTrmsAgree: builder.mutation<void, void>({
      query: () => ({
        url: "/user/agree-update",
        method: "PATCH",
      }),
    }),
  }),
});

export const { useUserTrmsAgreeMutation } = termsConditionsApi;
