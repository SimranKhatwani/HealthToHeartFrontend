import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const operationsApi = createApi({
  reducerPath: "operationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/operations`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Operations"],  // Add tag type
  endpoints: (builder) => ({
    getAllOperations: builder.query({
      query: () => "get-all-operation",
      providesTags: ["Operations"],  // Associate this query with a tag
    }),
    getDoctorOperations: builder.query({
      query: () => "get-doctor-operation",
      providesTags: ["Operations"],  // Associate this query with a tag
    }),
    createOperation: builder.mutation({
      query: (operationData) => ({
        url: "create-operation",
        method: "POST",
        body: operationData,
      }),
      invalidatesTags: ["Operations"], 
    }),
  }),
});

export const { useGetAllOperationsQuery, useCreateOperationMutation, useGetDoctorOperationsQuery } = operationsApi;
