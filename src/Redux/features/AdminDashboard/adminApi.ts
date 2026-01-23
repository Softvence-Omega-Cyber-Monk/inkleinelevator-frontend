import { baseApi } from "@/Redux/api/baseApi";

interface GetAllUserByAdminParams {
  userType?: string
  searchTerm?: string
  limit?: number
  page?: number
}
interface User {
  id: string
  name: string
  email: string
  role: string
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
}

interface GetAllUserByAdminResponse {
  data: User[]
  meta: PaginationMeta
}

const userJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
      getAdminAllAnalytics: builder.query({
        query: () => ({
          url: "/user/get-all-admin-analytics", 
          method: "GET",
        }),
      }),

      getAdminsRecentActivity: builder.query({
          query: () => ({
            url: "/user/get-recent-activity-form-admin", 
            method: "GET",
          }),
        }),
        
      getAllUserByAdmin: builder.query< GetAllUserByAdminResponse, void | GetAllUserByAdminParams>({
          query: (args) => {
            const params: Record<string, string | number> = {
              userType: "USER", 
              limit: 10,
              page: 1
            }
        
            if (args?.userType) params.userType = args.userType
            if (args?.searchTerm) params.search = args.searchTerm
            if (args?.limit) params.limit = args.limit
            if (args?.page) params.page = args.page
        
            return {
              url: "/user/all-user-by-admin",
              method: "GET",
              params,
            }
          },
      }),
      getAllJobByAdmin: builder.query<any, { page?: number; limit?: number } | void>({
        query: (args) => {
          const params: Record<string, string | number> = {
            page: 1,
            limit: 10
          };
          
          if (args?.page) params.page = args.page;
          if (args?.limit) params.limit = args.limit;
          
          return {
            url: "/job/get-all-job-by-admin", 
            method: "GET",
            params,
          };
        }, 
      }),

      getConstructorApprovalShortList: builder.query({
        query: () => ({
          url: "/user/constructor-approval-short-list", 
          method: "GET",
        }), 
        providesTags: ["ConstructorApproval"],
      }),

      verifyUserStatus: builder.mutation({
        query: ({id, status}) => ({
          url: `/user/verify-status/${id}`, 
          method: "PATCH",
          body: { "statusType": status }
        }),
        invalidatesTags: ["ConstructorApproval"],
      }),
  }),
});

export const {
    useGetAdminAllAnalyticsQuery,
    useGetConstructorApprovalShortListQuery,
    useGetAdminsRecentActivityQuery,
    useGetAllUserByAdminQuery,
    useGetAllJobByAdminQuery,
    useVerifyUserStatusMutation
} = userJobApi;
