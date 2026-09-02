import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const shiftApi = createApi({
  reducerPath: "shiftApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/shift`,
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
    // Get all shifts
    getShifts: builder.query({
      query: () => "/",
      providesTags: ["staffShift"],
    }),

    // Get shift by ID
    getShiftById: builder.query({
      query: (id) => `/${id}`,
    }),

    // Create a new shift
    createShift: builder.mutation({
      query: (shiftData) => ({
        url: "/",
        method: "POST",
        body: shiftData,
      }),
      invalidatesTags: ["staffShift"], 
    }),

    // Update a shift by ID
    updateShift: builder.mutation({
      query: ({ id, ...shiftData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: shiftData,
      }),
      invalidatesTags: ["staffShift"], 
    }),

    // Delete a shift by ID
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["staffShift"], 
    }),

    // Get shifts for a specific staff member
    getShiftsByStaffId: builder.query({
      query: (staffId) => `/staff/${staffId}`,
    }),

    // Get shifts by organization (only for superadmin)
    getShiftsByOrganization: builder.query({
      query: (orgId) => `/organization/${orgId}`,
    }),

    // Get shifts for a specific day
    getShiftsByDay: builder.query({
      query: (day) => `/day/${day}`,
    }),

    // Get active shifts
    getActiveShifts: builder.query({
      query: () => `/active`,
    }),

    // Get inactive shifts
    getInactiveShifts: builder.query({
      query: () => `/inactive`,
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftByIdQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useGetShiftsByStaffIdQuery,
  useGetShiftsByOrganizationQuery,
  useGetShiftsByDayQuery,
  useGetActiveShiftsQuery,
  useGetInactiveShiftsQuery,
} = shiftApi;
