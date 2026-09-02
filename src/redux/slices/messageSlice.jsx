import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/message`, credentials: "include" }),
  tagTypes: ["Messages"],  // Add tag type
  endpoints: (builder) => ({
    getAllMessages: builder.query({
      query: () => "/all",
      providesTags: ["Messages"],  
    }),
    getMessages: builder.query({
      query: () => "/",
      providesTags: ["Messages"],  
    }),
    createMessage: builder.mutation({
      query: (messageData) => ({
        url: "/",
        method: "POST",
        body: messageData,
      }),
      invalidatesTags: ["Messages"], 
    }),

  }),
});

export const { useCreateMessageMutation, useGetMessagesQuery, useGetAllMessagesQuery } = messageApi;