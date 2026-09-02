import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,  
    credentials: "include",
  }),
  tagTypes: ['Inventory'],  // Cache invalidation tag
  endpoints: (builder) => ({
    getInventory: builder.query({
      query: () => '/inventory/get',     // GET request
      providesTags: ['Inventory'],        // Cache invalidation
    }),
    createInventory: builder.mutation({
      query: (newItem) => ({
        url: '/inventory/create',
        method: 'POST',
        body: newItem,                   // Send new inventory data in the body
      }),
      invalidatesTags: ['Inventory'],    //  Invalidate cache after creation
    }),
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/delete/${id}`,  // Use dynamic ID in the URL
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],   // Invalidate cache after deletion
    }),
    updateInventory: builder.mutation({  // PUT (update) endpoint
      query: ({ id, updatedItem }) => ({
        url: `/inventory/update/${id}`,  // Use dynamic ID in the URL
        method: 'PUT',
        body: updatedItem,               // Send updated inventory data in the body
      }),
      invalidatesTags: ['Inventory'],   //  Invalidate cache after update
    }),
  }),
});

export const { 
  useGetInventoryQuery, 
  useCreateInventoryMutation, 
  useDeleteInventoryMutation, 
  useUpdateInventoryMutation  
} = inventoryApi;
