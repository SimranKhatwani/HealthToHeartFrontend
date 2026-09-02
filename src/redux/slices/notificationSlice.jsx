import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { socket } from "../../components/hooks/useInitSocket";

const apiUrl = import.meta.env.VITE_API_URL;

export const notificationsApi = createApi({
  reducerPath: "NotificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/notification`, credentials: "include" }),
  tagTypes: ["Notifications"],  // Add tag type
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => "get-notifications",
      providesTags: ["Notifications"],  
    }),
    getNotificationsByEmail: builder.query({
      query: (email) => `get-patient-notifications?email=${email}`,
      providesTags: ["Notifications"],
    }),
    createNotifications: builder.mutation({
      query: (notificationData) => ({
        url: "create-notification",
        method: "POST",
        body: notificationData,
      }),
      onQueryStarted: async (notificationData, { dispatch, queryFulfilled }) => {
        try {
          // Wait for the mutation response to resolve
          const { data } = await queryFulfilled;
          console.log("data", data)
          // Emitting the notification to socket after it's created
          // Assuming you have a socket instance in context or import it here

          socket.emit("notification-sent", {
            to: notificationData.receiver,
            message: data.data.message, // Assuming this is in the response
            notDesc: notificationData.notDesc,
          });

        } catch (error) {
          console.error("Error emitting socket notification:", error);
        }
      },
      invalidatesTags: ["Notifications"], 
    }),

    deleteNotifications: builder.mutation({
        query: (id) => ({
          url: `delete-notification/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Notifications"], 
    }),
    deleteAllNotifications: builder.mutation({
        query: () => ({
          url: `delete-allnotifications`,  // Use dynamic ID in the URL
          method: 'DELETE',
        }),
        invalidatesTags: ['Notifications'],   // Invalidate cache after deletion
      }),
  }),
});

export const { useGetAllNotificationsQuery, useGetNotificationsByEmailQuery, useCreateNotificationsMutation, useDeleteNotificationsMutation, useDeleteAllNotificationsMutation } = notificationsApi;
