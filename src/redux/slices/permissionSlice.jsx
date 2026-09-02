import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/permission`, credentials: "include" }),
  tagTypes: ["Permissions"],  // Add tag type
  endpoints: (builder) => ({
    getAllPermissions: builder.query({
      query: () => "/",
      providesTags: ["Permissions"],  
    }),
    createPermission: builder.mutation({
      query: (permissionData) => ({
        url: "/",
        method: "POST",
        body: permissionData,
      }),
      invalidatesTags: ["Permissions"], 
    }),
    updatePermission: builder.mutation({
      query: ({ id, ...permissionData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: permissionData,
      }),
      invalidatesTags: ["Permissions"], 
    }),
    
  }),
});

export const { useGetAllPermissionsQuery, useCreatePermissionMutation,  useUpdatePermissionMutation } = permissionsApi;
