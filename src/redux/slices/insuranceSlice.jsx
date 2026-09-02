import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;
export const insuranceApi = createApi({
  reducerPath: "insuranceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/insurance`,
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
    // ✅ Insurance Providers
    getInsuranceProviders: builder.query({
      query: () => "/providers",
    }),

    getInsuranceProviderById: builder.query({
      query: (id) => `/providers/${id}`,
    }),

    createInsuranceProvider: builder.mutation({
      query: (providerData) => ({
        url: "/providers",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerData),
      }),
    }),
    

    updateInsuranceProvider: builder.mutation({
      query: ({ id, ...providerData }) => ({
        url: `/providers/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerData),
      }),
    }),

    deleteInsuranceProvider: builder.mutation({
      query: (id) => ({
        url: `/providers/${id}`,
        method: "DELETE",
      }),
    }),

    // ✅ Insurance Claims
    getInsuranceClaims: builder.query({
      query: () => "/claims",
    }),

    getInsuranceClaimById: builder.query({
      query: (id) => `/claims/${id}`,
    }),

    createInsuranceClaim: builder.mutation({
      query: (claimData) => ({
        url: "/claims",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      }),
      invalidatesTags: ["Claims"], // This ensures cache updates
    }),
    
    updateInsuranceClaim: builder.mutation({
      query: ({ id, ...claimData }) => ({
        url: `/claims/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      }),
      invalidatesTags: ["Claims"], // Ensures updated data is fetched
    }),
    

    deleteInsuranceClaim: builder.mutation({
      query: (id) => ({
        url: `/claims/${id}`,
        method: "DELETE",
      }),
    }),

    // ✅ Get claims by provider ID
    getClaimsByProvider: builder.query({
      query: (providerId) => `/claims/provider/${providerId}`,
    }),

    // ✅ Get pending claims
    getPendingClaims: builder.query({
      query: () => "/claims/status/pending",
    }),

    // ✅ Get approved claims
    getApprovedClaims: builder.query({
      query: () => "/claims/status/approved",
    }),

    // ✅ Get rejected claims
    getRejectedClaims: builder.query({
      query: () => "/claims/status/rejected",
    }),
  }),
});

export const {
  // Insurance Providers
  useGetInsuranceProvidersQuery,
  useGetInsuranceProviderByIdQuery,
  useCreateInsuranceProviderMutation,
  useUpdateInsuranceProviderMutation,
  useDeleteInsuranceProviderMutation,

  // Insurance Claims
  useGetInsuranceClaimsQuery,
  useGetInsuranceClaimByIdQuery,
  useCreateInsuranceClaimMutation,
  useUpdateInsuranceClaimMutation,
  useDeleteInsuranceClaimMutation,
  useGetClaimsByProviderQuery,
  useGetPendingClaimsQuery,
  useGetApprovedClaimsQuery,
  useGetRejectedClaimsQuery,
} = insuranceApi;
