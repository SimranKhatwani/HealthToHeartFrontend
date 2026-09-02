import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`, 
    credentials: "include",  
  }),
  tagTypes: ['ReportApi'],  
  endpoints: (builder) => ({
    getReports: builder.query({
        query: (type) => {
          const queryString = type ? `?type=${type}` : '';
          return `/reports/get${queryString}`;
        },
        providesTags: ['ReportApi'],
    }),    
    createReports: builder.mutation({
      query: (newReport) => ({
        url: '/reports/create',
        method: 'POST',
        body: newReport,
      }),
      invalidatesTags: ['ReportApi'],
    }),
    editReports: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/reports/update/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: ['ReportApi'],  
    }),
    deleteReports: builder.mutation({
      query: (id) => ({
        url: `/reports/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ReportApi'],  
    }),
  }),
});

export const { 
  useGetReportsQuery, 
  useCreateReportsMutation,
  useEditReportsMutation,  
  useDeleteReportsMutation,
} = reportApi;
