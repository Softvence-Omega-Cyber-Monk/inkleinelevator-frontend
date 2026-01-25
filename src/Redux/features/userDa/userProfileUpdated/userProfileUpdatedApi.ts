import { baseApi } from "@/Redux/api/baseApi";

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: (body) => ({
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
    userChangePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    getMeUserWonData: builder.query({
      query: () => ({
        url: "/auth/getMe",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUserUploadProfileImageMutation,
  useUserChangePasswordMutation,
  useGetMeUserWonDataQuery,
} = userProfileApi;
