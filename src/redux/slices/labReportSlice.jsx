import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const labReportApi = createApi({
    reducerPath: "labReportApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/report`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["LabReport"],
    endpoints: (builder) => ({
        // Get all lab Reports
        getLabReports: builder.query({
            query: () => "/",
            providesTags: ["LabReport"],
        }),

        // create a new lab report
        createLabReport: builder.mutation({
            query: (testData) => ({
                url: "/",
                method: "POST",
                body: testData,
            }),
            invalidatesTags: ["LabReport"],
        }),
        // Update a lab test by ID
        updateLabReport: builder.mutation({
            query: ({ id, ...testData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: testData,
            }),
            invalidatesTags: ["LabReport"],
        }),
        deleteLabReport: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LabReport"],
        }),


    }),
});

export const {
    useGetLabReportsQuery,
    useCreateLabReportMutation,
    useUpdateLabReportMutation,
    useDeleteLabReportMutation
} = labReportApi;
