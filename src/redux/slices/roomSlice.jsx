import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

export const RoomApi = createApi({
  reducerPath: 'RoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`, 
    credentials: "include",  
  }),
  tagTypes: ['Room', 'AssignRoom'],  
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => '/room/get',     
      providesTags: ['Room'],
    }),
    getAssignRooms: builder.query({
      query: () => '/room/get-assign-room',     
      providesTags: ['AssignRoom'],
    }),
    createRooms: builder.mutation({
      query: (newRoom) => ({
        url: '/room/create',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['Room'],
    }),
    assignRooms: builder.mutation({
      query: (newRoom) => ({
        url: '/room/assign-room',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['AssignRoom'],
    }),
    editRoom: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/room/update/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: ['Room'],  
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/room/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],  
    }),
    deleteAssignRoom: builder.mutation({
      query: (id) => ({
        url: `/room/delete-assign-room/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AssignRoom'],  
    }),
  }),
});

// Correct export name to match the API definition
export const { 
  useGetRoomsQuery, 
  useGetAssignRoomsQuery, 
  useCreateRoomsMutation, 
  useAssignRoomsMutation, 
  useEditRoomMutation, 
  useDeleteRoomMutation,
  useDeleteAssignRoomMutation,
} = RoomApi;
