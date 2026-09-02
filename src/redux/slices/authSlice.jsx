import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    fetchLoggedInUser: builder.query({
      query: () => 'utills/user-details',  // Ensure this matches your backend route
    }),
  }),  // Missing closing parenthesis was added here
});

export const { useFetchLoggedInUserQuery } = apiSlice;  // Use the correct export name
