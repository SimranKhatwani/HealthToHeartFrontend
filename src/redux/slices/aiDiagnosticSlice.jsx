import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const aiDiagnosticApi = createApi({
  reducerPath: "aiDiagnosticApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/diagnostics`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AIDiagnostic"],
  endpoints: (builder) => ({
    // Fetch all AI diagnostics
    getAIDiagnostics: builder.query({
      query: () => "/",
      providesTags: ["AIDiagnostic"],
    }),

    // Fetch a single diagnostic by ID
    getAIDiagnosticById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "AIDiagnostic", id }],
    }),

    // Create a new AI diagnostic
    createAIDiagnostic: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AIDiagnostic"],
    }),
  }),
});

export const {
  useGetAIDiagnosticsQuery,
  useGetAIDiagnosticByIdQuery,
  useCreateAIDiagnosticMutation,
} = aiDiagnosticApi;
