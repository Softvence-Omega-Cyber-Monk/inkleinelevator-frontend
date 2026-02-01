import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi", // or just "api" if you prefer
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api",
    baseUrl: "https://inkleinelevator-server.onrender.com",
    // baseUrl: "https://api.inkleinelevators.com",

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Don't set Content-Type for FormData - let the browser set it with boundary
      // RTK Query will automatically handle FormData and set the correct headers
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "MessageChatList",
    "MessageHistory",
    "ConstructorApproval",
    "RequesterApproval",
  ],
});

// with refresh token support

// import {
//   createApi,
//   fetchBaseQuery,
//   BaseQueryFn,
//   FetchArgs,
//   BaseQueryApi,
// } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../store";
// import { setUser, logout } from "../features/auth/authSlice";
// import { toast } from "sonner";

// const baseQuery = fetchBaseQuery({
//   // baseUrl: "http://localhost:5000/api",
//   baseUrl: "https://inkleinelevator-server.onrender.com",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken;
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// const baseQueryWithRefreshToken: BaseQueryFn<
//   FetchArgs,
//   unknown,
//   unknown
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status === 404) {
//     const message = (result.error as any)?.data?.message || "Not found";
//     toast.error(message);
//   }

//   if (result?.error?.status === 403) {
//     const message = (result.error as any)?.data?.message || "Forbidden";
//     toast.error(message);
//   }

//   if (result?.error?.status === 401) {
//     // Access token expired → try refresh
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (refreshToken) {
//       try {
//         const res = await fetch(
//           "https://inkleinelevator-server.onrender.com/auth/refresh-token",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refreshToken }),
//           },
//         );
//         const data = await res.json();

//         if (data?.data?.tokens?.accessToken) {
//           const user = (api.getState() as RootState).auth.user;

//           // Update Redux and localStorage
//           api.dispatch(
//             setUser({
//               user,
//               token: data.data.tokens.accessToken,
//             }),
//           );
//           localStorage.setItem("accessToken", data.data.tokens.accessToken);
//           if (data.data.tokens.refreshToken) {
//             localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
//           }

//           // Retry original query
//           result = await baseQuery(args, api, extraOptions);
//         } else {
//           api.dispatch(logout());
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           toast.error("Session expired. Please login again.");
//         }
//       } catch (err) {
//         api.dispatch(logout());
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         toast.error("Session expired. Please login again.");
//       }
//     } else {
//       api.dispatch(logout());
//       toast.error("Session expired. Please login again.");
//     }
//   }

//   return result;
// };

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: baseQueryWithRefreshToken,
//   tagTypes: ["User"],
//   endpoints: () => ({}),
// });
