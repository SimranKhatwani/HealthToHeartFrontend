import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/schedules`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Schedule"],
  

  endpoints: (builder) => ({
    //  Get all schedules (for org or all if super admin)
    getAllSchedules: builder.query({
      query: () => "/",
      providesTags: ["Schedule"],
    }),

    //  Get all schedules for a specific doctor
    getSchedulesByDoctor: builder.query({
      query: (doctorId) => `/${doctorId}`,
      providesTags: ["Schedule"],
    }),

    //  Get available slots for a specific doctor on a date
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) => ({
        url: `/available`,
        method: "POST",
        body: { doctorId, date },
      }),
    }),

    //  Create new schedule
    createSchedule: builder.mutation({
      query: (newSchedule) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchedule),
      }),
      invalidatesTags: ["Schedule"],
    }),

    //  Delete schedule by ID
    deleteSchedule: builder.mutation({
      query: (scheduleId) => ({
        url: `/${scheduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schedule"],
    }),
    //  Update schedule by ID
    updateSchedule: builder.mutation({
      query: ({ scheduleId, ...scheduleData }) => ({
        url: `/${scheduleId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      }),
      invalidatesTags: ["Schedule"],
    })
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetSchedulesByDoctorQuery,
  useGetAvailableSlotsQuery,
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useUpdateScheduleMutation
} = scheduleApi;
