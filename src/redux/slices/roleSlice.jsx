import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/roles`, // Adjust if needed
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Roles"],

  endpoints: (builder) => ({
    //  Fetch all roles
    getRoles: builder.query({
      query: () => "/",
      providesTags: ["Roles"],
    }),

    getRolePermissions: builder.query({
      query: () => `/role-permissions`,
      providesTags: ["Roles"],
    }),

    //  Fetch a single role by ID
    getRoleById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Roles"],
    }),


    //  Create a new role
    createRole: builder.mutation({
      query: (roleData) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      }),
      invalidatesTags: ["Roles"],
    }),

    //  Update an existing role
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      }),
      invalidatesTags: ["Roles"],
    }),

    //  Delete a role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery
} = roleApi;

