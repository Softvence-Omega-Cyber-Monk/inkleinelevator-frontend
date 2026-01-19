import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/signIn",
        method: "POST",
        body: userInfo,
      }),
    }),
    // register endpoint
    register: builder.mutation({
      query: (formData) => ({
        url: "/auth/signup",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
