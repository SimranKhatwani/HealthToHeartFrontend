import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

export const mealPlanApi = createApi({
  reducerPath: 'mealPlanApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`, 
    credentials: "include",  
  }),
  tagTypes: ['MealPlan'],  
  endpoints: (builder) => ({
    getMealPlans: builder.query({
      query: () => '/meal-plans/get-all',     // GET request
      providesTags: ['MealPlan'],        // Cache invalidation
    }),
    getPatientMeal: builder.query({
      query: () => '/meal-plans/get-patient-meal',     // GET request
      providesTags: ['PatientMeal'],        // Cache invalidation
    }),
    createMealPlan: builder.mutation({
      query: (newItem) => ({
        url: '/meal-plans/create',
        method: 'POST',
        body: newItem,                   // Send new inventory data in the body
      }),
      invalidatesTags: ['MealPlan'],    //  Invalidate cache after creation
    }),
    createPatientMeal: builder.mutation({
      query: (newItem) => ({
        url: '/meal-plans/create-patient-meal',
        method: 'POST',
        body: newItem,                   // Send new inventory data in the body
      }),
      invalidatesTags: ['PatientMeal'],    //  Invalidate cache after creation
    }),
    editMealPlan: builder.mutation({
        query: ({ id, ...updatedFields }) => ({
          url: `/meal-plans/edit/${id}`,
          method: 'PUT',
          body: updatedFields, // send only the fields to update
        }),
        invalidatesTags: ['MealPlan'],
    }),    
    editAssignMealPlan: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/meal-plans/edit-assign-meal/${id}`,
        method: 'PUT',
        body: updatedFields, // send only the fields to update
      }),
      invalidatesTags: ['PatientMeal'],
    }),      
    deleteMealPlan: builder.mutation({
      query: (id) => ({
        url: `/meal-plans/delete/${id}`,  // Use dynamic ID in the URL
        method: 'DELETE',
      }),
      invalidatesTags: ['MealPlan'],   // Invalidate cache after deletion
    }),
    deleteAssignMealPlan: builder.mutation({
      query: (id) => ({
        url: `meal-plans/delete-assign-plan/${id}`,  // Use dynamic ID in the URL
        method: 'DELETE',
      }),
      invalidatesTags: ['PatientMeal'],   // Invalidate cache after deletion
    }),
  }),
});

export const { 
  useGetMealPlansQuery, 
  useGetPatientMealQuery, 
  useCreateMealPlanMutation, 
  useCreatePatientMealMutation, 
  useEditMealPlanMutation, 
  useEditAssignMealPlanMutation, 
  useDeleteMealPlanMutation, 
  useDeleteAssignMealPlanMutation, 
} = mealPlanApi;
