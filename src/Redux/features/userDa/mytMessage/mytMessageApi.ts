import { baseApi } from "@/Redux/api/baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendTMessage: builder.mutation({
      query: (body: { receiverId: string; text: string }) => ({
        url: "/message/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendTMessageMutation } = messageApi;
