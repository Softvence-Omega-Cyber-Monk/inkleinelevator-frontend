import { baseApi } from "../../api/baseApi";

// interface UpdateUserProfileDto {
//   name?: string;
//   companyName?: string;
//   businessLogo?: string;
//   companyDescription?: string;
//   servicesType?: string;
//   yearFounded?: string;
//   numberOfEmployee?: string;
//   website?: string;
//   businessAddress?: string;
//   licenseNo?: string;
//   licenseInfo?: string;
//   isNotification?: boolean;
// }

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    companyName?: string;
    businessLogo?: string;
    profile?: string | null;
    licenseInfo?: string | null;
    licenseNo?: string | null;
    companyDescription?: string | null;
    servicesType?: string | null;
    yearFounded?: string | null;
    numberOfEmployee?: string | null;
    website?: string | null;
    businessAddress?: string | null;
    stripeAccountId?: string;
    isNotification?: boolean;
    verifidStatus?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// interface ChangePasswordDto {
//   oldPassword: string;
//   newPassword: string;
// }

// interface ChangePasswordResponse {
//   success: boolean;
//   message: string;
// }

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
    // Get user own profile
    getMe: builder.mutation({
      query: () => ({
        url: "/auth/getMe",
        method: "POST",
      }),
    }),
    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body: profileData,
      }),
    }),
    // Delete own profile
    deleteOwnProfile: builder.mutation({
      query: () => ({
        url: "/user/ownProfileDelete",
        method: "DELETE",
      }),
    }),
    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    // Upload profile image
    uploadProfile: builder.mutation<UserProfileResponse, FormData>({
      query: (formData) => ({
        url: "/auth/upload-profile",
        method: "POST",
        body: formData,
      }),
    }),
    // core auth endpoints
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/auth/request-reset-code",
        method: "POST",
        body: emailData, // { email: "user@example.com" }
      }),
    }),
    // verify OTP endpoint
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body: data, // { email: "...", code: "1234" }
      }),
    }),
    // for reset
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetData, // { token: "...", password: "newPassword" }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeMutation,
  useUpdateProfileMutation,
  useDeleteOwnProfileMutation,
  useChangePasswordMutation,
  useUploadProfileMutation,
  // core auth
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
