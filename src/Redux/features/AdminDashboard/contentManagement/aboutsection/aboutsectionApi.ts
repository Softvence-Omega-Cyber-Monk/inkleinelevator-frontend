import { baseApi } from "@/Redux/api/baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create About Section (one-time)
    createAboutContent: builder.mutation({
      query: (body) => ({
        url: "/content-management-about/create",
        method: "POST",
        body,
      }),
    }),

    // Get About Section
    getAboutContent: builder.query({
      query: () => ({
        url: "/content-management-about/retrived",
        method: "GET",
      }),
    }),

    // Update About Section
    updateAboutContent: builder.mutation({
      query: (body) => ({
        url: "/content-management-about/update",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useCreateAboutContentMutation,
  useGetAboutContentQuery,
  useUpdateAboutContentMutation,
} = aboutApi;

export default aboutApi;
