import { baseApi } from "@/Redux/api/baseApi";

export const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contactUser: builder.mutation({
      query: (body) => ({
        url: "/contact-user/contact-us",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useContactUserMutation } = contactUsApi;
