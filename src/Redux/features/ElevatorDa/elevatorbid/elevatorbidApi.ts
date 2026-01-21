import { baseApi } from "@/Redux/api/baseApi";

interface BidJobRequest {
  jobId: string;
  bidAmount: number;
  completionTimeline: string;
  timeline: number;
  brefProposal: string;
}

interface BidJobResponse {
  success: boolean;
  message: string;
  data: {
    bidId: string;
    userId: string;
    jobId: string;
    bidAmount: number;
    timeline: number;
    completionTimeline: string;
    brefProposal: string;
    status: string;
  };
}

interface MyBidItem {
  bidId: string;
  userId: string;
  jobId: string;
  bidAmount: number;
  timeline: number;
  completionTimeline: string;
  brefProposal: string;
  status: string;
  job: {
    jobId: string;
    jobTitle: string;
    jobType: string;
    projectDescription: string;
  };
}

interface MyBidsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      totalPage: number;
      page: number;
      limit: number;
    };
    data: MyBidItem[];
  };
}

interface MyBidsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

const elevatorbidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Bid on a job
    bidJob: builder.mutation<BidJobResponse, BidJobRequest>({
      query: (bidData) => ({
        url: "/bid/bid-jobs",
        method: "POST",
        body: bidData,
      }),
    }),
    // Get my bids
    getMyBids: builder.query<MyBidsResponse, MyBidsQueryParams>({
      query: ({ page = 0, limit = 10, searchTerm }) => ({
        url: "/bid/my-bids",
        method: "GET",
        params: {
          page: page.toString(),
          limit: limit.toString(),
          ...(searchTerm && { searchTerm }),
        },
      }),
    }),
  }),
});

export const { useBidJobMutation, useGetMyBidsQuery } = elevatorbidApi;
