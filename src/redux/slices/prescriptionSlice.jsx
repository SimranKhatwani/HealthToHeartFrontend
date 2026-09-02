import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const prescriptionApi = createApi({
  reducerPath: "prescriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/prescription`,
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
    // Get all prescriptions
    getAllPrescriptions: builder.query({
      query: () => "/",
    }),

    // Get prescriptions by email
    getPrescriptionsByEmail: builder.query({
      query: (email) => `/by-email?email=${email}`,
    }),

    // Create a new prescription
    createPrescription: builder.mutation({
      query: (prescriptionData) => ({
        url: "/",
        method: "POST",
        body: prescriptionData,
      }),
    }),

    // Update a prescription by ID
    updatePrescription: builder.mutation({
      query: ({ id, ...prescriptionData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: prescriptionData,
      }),
    }),

    // Delete a prescription by ID
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

    // Change prescription filled status
    changeFilledStatus: builder.mutation({
      query: ({ id, filledStatus }) => ({
        url: `/changestatus/${id}`,
        method: "PUT"
      }),
    }),
  }),
});

export const {
  useGetAllPrescriptionsQuery,
  useGetPrescriptionsByEmailQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useChangeFilledStatusMutation,
} = prescriptionApi;
