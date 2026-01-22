import { baseApi } from "@/Redux/api/baseApi";

interface ChatUser {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

interface GetChatListResponse {
  success: boolean;
  message: string;
  data: ChatUser[] | Record<string, any>;
}

interface SendMessageDto {
  receiverId: string;
  text: string;
}

interface SendMessageResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  [key: string]: any;
}

interface GetMessageHistoryResponse {
  success: boolean;
  message: string;
  data: Message[];
}

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get chat list users
    getChatListUser: builder.query<GetChatListResponse, void>({
      query: () => ({
        url: "/message/users/chatListUser",
        method: "GET",
      }),
      providesTags: ["MessageChatList"],
    }),
    // Send a message
    sendMessage: builder.mutation<SendMessageResponse, SendMessageDto>({
      query: (body) => ({
        url: "/message/send",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { receiverId }) => [
        { type: "MessageHistory", id: receiverId },
        "MessageChatList",
      ],
    }),
    // Get message history with a user
    getMessageHistory: builder.query<GetMessageHistoryResponse, { withUserId: string | number }>({
      query: ({ withUserId }) => ({
        url: "/message/history",
        method: "GET",
        params: {
          withUserId,
        },
      }),
      providesTags: (_result, _error, { withUserId }) => [
        { type: "MessageHistory", id: withUserId },
      ],
    }),
  }),
});

export const {
  useGetChatListUserQuery,
  useSendMessageMutation,
  useGetMessageHistoryQuery,
} = messageApi;
