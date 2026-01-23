import { baseApi } from "@/Redux/api/baseApi";

interface Notification {
  notificationId: string;
  title?: string;
  message?: string;
  description?: string;
  isSeen: boolean;
  createdAt?: string;
  updatedAt?: string;
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
    markNotificationAsSeen: builder.mutation<MarkAsSeenResponse, string>({
      query: (notificationId) => ({
        url: `/notification/isSeen/${notificationId}`,
        method: "PATCH",
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getAllOwnNotification",
            undefined,
            (draft) => {
              const notification = draft.data.data.find(
                (n) => n.notificationId === notificationId
              );
              if (notification && !notification.isSeen) {
                notification.isSeen = true;
                // Update notSeenCount
                draft.data.notSeenCount = Math.max(
                  0,
                  (draft.data.notSeenCount ?? 0) - 1
                );
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, revert the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllOwnNotificationQuery,
  useMarkNotificationAsSeenMutation,
} = notificationApi;
