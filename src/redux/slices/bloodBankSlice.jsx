import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const bloodBankApi = createApi({
  reducerPath: "bloodBankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/blood-bank`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all blood banks
    fetchBloodBanks: builder.query({
      query: () => "/get-all",
      providesTags: ["AddBlood"],
    }),

    // Fetch all blood donations
    fetchBloodDonations: builder.query({
      query: () => "/get-all-donation",
      providesTags: ["AddDonation"],
    }),

    // Fetch all blood requests
    fetchBloodRequests: builder.query({
      query: () => "/get-all-req",
      providesTags: ["AddBloodReq"]
    }),

    // Create a new blood bank entry
    createBloodBank: builder.mutation({
      query: (newBloodBank) => ({
        url: "/create",
        method: "POST",
        body: newBloodBank,
      }),
      invalidatesTags: ["AddBlood"], 
    }),

    // Create a new blood donation
    createBloodDonation: builder.mutation({
      query: (newDonation) => ({
        url: "/create-blood-donation",
        method: "POST",
        body: newDonation,
      }),
      invalidatesTags: ["AddBlood", "AddDonation"],
    }),

    // Create a new blood request
    createBloodRequest: builder.mutation({
      query: (newBloodRequest) => ({
        url: "/create-req", 
        method: "POST",
        body: newBloodRequest,
      }),
      invalidatesTags: ["AddBloodReq"], 
    }),
  }),
});

// Auto-generated hooks for components
export const {
  useFetchBloodBanksQuery,
  useFetchBloodDonationsQuery,
  useFetchBloodRequestsQuery,
  useCreateBloodBankMutation,
  useCreateBloodDonationMutation,
  useCreateBloodRequestMutation, // New hook for creating a blood request
} = bloodBankApi;
