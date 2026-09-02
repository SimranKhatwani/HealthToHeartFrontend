import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/organization`, credentials: "include" }),
  tagTypes: ["Organization"],  // Add tag type
  endpoints: (builder) => ({
    getAllOrganization: builder.query({
      query: () => "/",
      providesTags: ["Organization"],  
    }),
    createOrganization: builder.mutation({
      query: (organizationData) => ({
        url: "/",
        method: "POST",
        body: organizationData,
      }),
      invalidatesTags: ["Organization"], 
    }),
  }),
});

export const { useGetAllOrganizationQuery, useCreateOperationMutation } = organizationApi;
