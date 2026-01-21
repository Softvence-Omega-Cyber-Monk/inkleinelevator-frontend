import { baseApi } from "../../api/baseApi";

interface UpdateUserProfileDto {
  name?: string;
  companyName?: string;
  businessLogo?: string;
  companyDescription?: string;
  servicesType?: string;
  yearFounded?: string;
  numberOfEmployee?: string;
  website?: string;
  businessAddress?: string;
  licenseNo?: string;
  licenseInfo?: string;
  isNotification?: boolean;
}

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
    getMe: builder.mutation<UserProfileResponse, void>({
      query: () => ({
        url: "/auth/getMe",
        method: "POST",
      }),
    }),
    // Update user profile
    updateProfile: builder.mutation<UserProfileResponse, UpdateUserProfileDto>({
      query: (profileData) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body: profileData,
      }),
    }),
    // Delete own profile
    deleteOwnProfile: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/user/ownProfileDelete",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeMutation, useUpdateProfileMutation, useDeleteOwnProfileMutation } = authApi;
