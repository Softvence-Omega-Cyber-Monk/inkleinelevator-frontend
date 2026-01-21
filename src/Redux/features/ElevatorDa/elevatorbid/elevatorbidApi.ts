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

interface RecentBidItem {
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
    userId: string;
    jobTitle: string;
    jobType: string;
    projectDescription: string;
    technicalRequermentAndCertification?: string[];
    elevatorType?: string;
    numberOfElevator?: number;
    capasity?: string;
    speed?: string;
    address?: string;
    streetAddress?: string;
    city?: string;
    zipCode?: string;
    photo?: string[];
    documents?: string[];
    estimitedBudget?: string;
    jobStatus?: string;
    paymentStatus?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface GetElevatorRecentBidsResponse {
  success: boolean;
  message: string;
  data: RecentBidItem[];
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
    // Get elevator all recent bids
    getElevatorAllRecentBid: builder.query<GetElevatorRecentBidsResponse, void>({
      query: () => ({
        url: "/user/get-elevator-all-recent-bid",
        method: "GET",
      }),
    }),
  }),
});

export const { useBidJobMutation, useGetMyBidsQuery, useGetElevatorAllRecentBidQuery } = elevatorbidApi;
