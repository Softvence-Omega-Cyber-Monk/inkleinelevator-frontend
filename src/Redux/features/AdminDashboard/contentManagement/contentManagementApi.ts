import { baseApi } from "@/Redux/api/baseApi";

const contentManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Hero Section (one-time)
    createHeroContent: builder.mutation({
      query: (body) => ({
        url: "/content-management/create-hero",
        method: "POST",
        body,
      }),
    }),

    // Get Hero Section
    getHeroContent: builder.query({
      query: () => ({
        url: "/content-management/get-hero",
        method: "GET",
      }),
    }),

    // Update Hero Section
    updateHeroContent: builder.mutation({
      query: (body) => ({
        url: "/content-management/update-hero",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useCreateHeroContentMutation,
  useGetHeroContentQuery,
  useUpdateHeroContentMutation,
} = contentManagementApi;



