import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/medicalstaff`,
    credentials: "include", // Ensures cookies & authentication headers are included
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["MedicalStaff"], 

  endpoints: (builder) => ({
    //  Fetch all doctors
    getDoctors: builder.query({
      query: () => "/",
      providesTags: ["MedicalStaff"],
    }),

    //  Fetch a single doctor by ID
    getDoctorById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["MedicalStaff"],
    }),

    //  Fetch doctors by role (e.g., "Doctor", "Nurse")
    getDoctorsByRole: builder.query({
      query: (roleName) => `/${roleName}`,
      providesTags: ["MedicalStaff"],
    }),

    //  Add a new doctor
    addDoctor: builder.mutation({
      query: (newDoctor) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor), // Ensure proper JSON
      }),
    }),

    //  Update doctor details
    updateDoctor: builder.mutation({
      query: (formData) => ({
        url: `/edit-profile`,
        method: "PUT",
        body: formData, // formData is passed already prepared
      }),
      invalidatesTags: ["MedicalStaff"],
    }),
    
    

    //  Delete a doctor
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MedicalStaff"], // Refresh list after deletion
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorsByRoleQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;
