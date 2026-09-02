import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    credentials: "include",   // Automatically include cookies/tokens
  }),
  endpoints: (builder) => ({
    // Fetch All Appointments
    getAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["appointments"],
    }),

    // Fetch Single Appointment by ID
    getAppointmentById: builder.query({
      query: (id) => `/appointments/${id}`,
    }),

    // Create New Appointment
    createAppointment: builder.mutation({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["appointments"], 
    }),

    // Update Appointment by ID
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["appointments"],
    }),

    // Delete Appointment by ID
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["appointments"],
    }),
  }),
});

export const { 
  useGetAppointmentsQuery, 
  useGetAppointmentByIdQuery, 
  useCreateAppointmentMutation, 
  useUpdateAppointmentMutation, 
  useDeleteAppointmentMutation 
} = appointmentsApi;
