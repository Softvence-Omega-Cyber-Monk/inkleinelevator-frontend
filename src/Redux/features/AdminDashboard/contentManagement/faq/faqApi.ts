import { baseApi } from "@/Redux/api/baseApi";

interface FAQ {
  qaCardId: string;
  question: string;
  ans: string;
}

interface GetAllFAQsResponse {
  success: boolean;
  message: string;
  data: FAQ[];
}

interface CreateFAQRequest {
  question: string;
  ans: string;
}

interface CreateFAQResponse {
  success: boolean;
  message: string;
  data: FAQ;
}

interface UpdateFAQRequest {
  question: string;
  ans: string;
}

interface UpdateFAQResponse {
  success: boolean;
  message: string;
  data: FAQ;
}

interface DeleteFAQResponse {
  success: boolean;
  message: string;
}

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs
    getAllFAQs: builder.query<GetAllFAQsResponse, void>({
      query: () => ({
        url: "/faq/all",
        method: "GET",
      }),
    }),

    // Create a new FAQ
    createFAQ: builder.mutation<CreateFAQResponse, CreateFAQRequest>({
      query: (body) => ({
        url: "/faq/create",
        method: "POST",
        body,
      }),
    }),

    // Update an existing FAQ
    updateFAQ: builder.mutation<
      UpdateFAQResponse,
      { id: string; data: UpdateFAQRequest }
    >({
      query: ({ id, data }) => ({
        url: `/faq/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete an FAQ
    deleteFAQ: builder.mutation<DeleteFAQResponse, string>({
      query: (id) => ({
        url: `/faq/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;

export default faqApi;
