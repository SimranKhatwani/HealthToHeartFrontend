import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const abhaApi = createApi({
  reducerPath: "abhaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/abha`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AbhaSession"],
  endpoints: (builder) => ({
    // 1. Search for existing ABHA account (v1/search/searchByHealthId)
    searchAbhaAccount: builder.mutation({
      query: (payload) => ({
        url: "/search",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    }),

    // 2. Initiate authentication (v1/auth/init)
    initiateAbhaAuth: builder.mutation({
      query: (payload) => ({
        url: "/auth/init",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      invalidatesTags: ["AbhaSession"],
    }),

    // 3. Confirm Mobile OTP (v1/auth/confirmWithMobileOTP)
    confirmAbhaMobileOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/confirm-mobile-otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      invalidatesTags: ["AbhaSession"],
    }),

    // 4. Confirm Aadhaar OTP (v1/auth/confirmWithAadhaarOtp)
    confirmAbhaAadhaarOtp: builder.mutation({
      query: (payload) => ({
        url: "/auth/confirm-aadhaar-otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      invalidatesTags: ["AbhaSession"],
    }),

    // 5. Retrieve verified patient profile post-auth (v1/account/profile)
    getAbhaProfile: builder.query({
      query: (transactionId) => `/account/profile/${transactionId}`,
    }),

    // 6. Check verification session status
    getAbhaSessionStatus: builder.query({
      query: (transactionId) => `/session/${transactionId}`,
      providesTags: ["AbhaSession"],
    }),

    // 7. Obtain public certificate (v1/auth/cert)
    getAbhaPublicCert: builder.query({
      query: () => "/auth/cert",
    }),
  }),
});

export const {
  useSearchAbhaAccountMutation,
  useInitiateAbhaAuthMutation,
  useConfirmAbhaMobileOtpMutation,
  useConfirmAbhaAadhaarOtpMutation,
  useGetAbhaProfileQuery,
  useGetAbhaSessionStatusQuery,
  useGetAbhaPublicCertQuery,
} = abhaApi;
