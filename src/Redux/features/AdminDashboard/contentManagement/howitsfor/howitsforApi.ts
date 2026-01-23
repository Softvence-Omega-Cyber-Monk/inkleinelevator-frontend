import { baseApi } from "@/Redux/api/baseApi";

interface Audience {
  audienceId: string;
  sectionId: string;
  type: string;
  cardTitle: string;
  cardSubtitle: string;
  bulletText: string;
  createdAt: string;
  updatedAt: string;
}

interface HowItsForSection {
  sectionId: string;
  how_its_for_key: string;
  label: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  audiences: Audience[];
}

interface GetHowItsForSectionResponse {
  success: boolean;
  message: string;
  data: HowItsForSection;
}

interface CreateSectionRequest {
  label: string;
  title: string;
  subtitle: string;
}

interface UpdateSectionRequest {
  label: string;
  title: string;
  subtitle: string;
}

interface CreateCardRequest {
  type: string;
  cardTitle: string;
  cardSubtitle: string;
  bulletText: string;
}

interface UpdateCardRequest {
  type: string;
  cardTitle: string;
  cardSubtitle: string;
  bulletText: string;
}

interface CreateCardResponse {
  success: boolean;
  message: string;
  data: Audience;
}

interface UpdateCardResponse {
  success: boolean;
  message: string;
  data: Audience;
}

const howItsForApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get How It's For section with audiences
    getHowItsForSection: builder.query<GetHowItsForSectionResponse, void>({
      query: () => ({
        url: "/how-its-for-content-management/get-how-its-for-section",
        method: "GET",
      }),
    }),

    // Create How It's For section (one-time)
    createHowItsForSection: builder.mutation<
      { success: boolean; message: string; data: HowItsForSection },
      CreateSectionRequest
    >({
      query: (body) => ({
        url: "/how-its-for-content-management/create",
        method: "POST",
        body,
      }),
    }),

    // Update How It's For section
    updateHowItsForSection: builder.mutation<
      { success: boolean; message: string; data: HowItsForSection },
      UpdateSectionRequest
    >({
      query: (body) => ({
        url: "/how-its-for-content-management/update",
        method: "PATCH",
        body,
      }),
    }),

    // Create a card/audience
    createCard: builder.mutation<CreateCardResponse, CreateCardRequest>({
      query: (body) => ({
        url: "/how-its-for-content-management/card/create",
        method: "POST",
        body,
      }),
    }),

    // Update a card/audience
    updateCard: builder.mutation<
      UpdateCardResponse,
      { id: string; data: UpdateCardRequest }
    >({
      query: ({ id, data }) => ({
        url: `/how-its-for-content-management/card/update/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetHowItsForSectionQuery,
  useCreateHowItsForSectionMutation,
  useUpdateHowItsForSectionMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
} = howItsForApi;

export default howItsForApi;
