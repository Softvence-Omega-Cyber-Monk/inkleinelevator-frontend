import { baseApi } from "@/Redux/api/baseApi";

interface Notification {
  id: number;
  [key: string]: any;
}

interface GetAllNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notSeenCount: number;
    data: Notification[];
  };
}

interface MarkAsSeenResponse {
  success: boolean;
  message: string;
  data?: any;
}

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all own notifications
    getAllOwnNotification: builder.query<GetAllNotificationsResponse, void>({
      query: () => ({
        url: "/notification/getAllOwnNotification",
        method: "GET",
      }),
    }),
    // Mark notification as seen
    markNotificationAsSeen: builder.mutation<MarkAsSeenResponse, number>({
      query: (notificationId) => ({
        url: `/notification/isSeen/${notificationId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetAllOwnNotificationQuery,
  useMarkNotificationAsSeenMutation,
} = notificationApi;
