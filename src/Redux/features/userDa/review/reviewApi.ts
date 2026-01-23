import { baseApi } from "@/Redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (body) => ({
        url: "/review/create-review",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateReviewMutation } = reviewApi;
