import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const labTestApi = createApi({
  reducerPath: "labTestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/labtests`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["LabTest"],
  endpoints: (builder) => ({
    // Get all lab tests
    getLabTests: builder.query({
      query: () => "/",
      providesTags: ["LabTest"],
    }),

    // Get lab test by ID
    getLabTestById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "LabTest", id }],
    }),

    // Create a new lab test
    createLabTest: builder.mutation({
      query: (testData) => ({
        url: "/",
        method: "POST",
        body: testData,
      }),
      invalidatesTags: ["LabTest"],
    }),

    // Update a lab test by ID
    updateLabTest: builder.mutation({
      query: ({ id, ...testData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: testData,
      }),
      invalidatesTags: ["LabTest"],
    }),

    // Mark sample as collected
    markSampleCollected: builder.mutation({
      query: ({ id, sampleData }) => ({
        url: `/${id}/sample`,
        method: "PUT",
        body: sampleData,
      }),
      invalidatesTags: ["LabTest"],
    }),

    // Update lab test status
    updateLabTestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["LabTest"],
    }),

    // Delete a lab test by ID
    deleteLabTest: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LabTest"],
    }),
  }),
});

export const {
  useGetLabTestsQuery,
  useGetLabTestByIdQuery,
  useCreateLabTestMutation,
  useUpdateLabTestMutation,
  useMarkSampleCollectedMutation,
  useUpdateLabTestStatusMutation,
  useDeleteLabTestMutation,
} = labTestApi;
