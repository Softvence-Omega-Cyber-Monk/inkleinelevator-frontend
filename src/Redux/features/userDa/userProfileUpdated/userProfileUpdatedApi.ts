import { baseApi } from "@/Redux/api/baseApi";

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: ({ body }) => ({
        // url: `/user/${userId}/update-profile`,
        url: `/user/update-profile`,
        method: "PATCH",
        body,
      }),
    }),
    // only for image upload purpose
    userUploadProfileImage: builder.mutation({
      query: (payload) => ({
        url: "/auth/upload-profile",
        method: "POST",
        body: payload, // pass FormData directly from component
      }),
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUserUploadProfileImageMutation,
} = userProfileApi;
