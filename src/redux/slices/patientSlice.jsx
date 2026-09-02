import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
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
    getPatients: builder.query({
      query: () => ({
        url: `/patients`,
        method: "GET",
      }),
    }),

    getPatientById: builder.query({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "GET",
      }),
    }),
    getPatientDetails: builder.query({
      query: (patientData) => ({
        url: `/patients/details`,
        method: "POST",
        body: patientData,
      }),
    }),

    addPatient: builder.mutation({
      query: (patientData) => ({
        url: `/patients`,
        method: "POST",
        body: patientData,
      }),
    }),

    updatePatient: builder.mutation({
      query: ({ id, patientData }) => ({
        url: `/patients/${id}`,
        method: "PATCH",
        body: patientData,
      }),
    }),

    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
    }),

    addVisit: builder.mutation({
      query: ({ id, visitData }) => ({
        url: `/patients/${id}/visits`,
        method: "POST",
        body: visitData,
      }),
    }),

    addMedicalHistory: builder.mutation({
      query: ({ id, historyData }) => ({
        url: `/patients/${id}/medical-history`,
        method: "POST",
        body: historyData,
      }),
    }),

    addPrescription: builder.mutation({
      query: ({ id, prescriptionData }) => ({
        url: `/patients/${id}/prescriptions`,
        method: "POST",
        body: prescriptionData,
      }),
    }),

    updateDischarge: builder.mutation({
      query: ({ id, dischargeData }) => ({
        url: `/patients/${id}/discharge`,
        method: "PATCH",
        body: dischargeData,
      }),
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientDetailsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useAddVisitMutation,
  useAddMedicalHistoryMutation,
  useAddPrescriptionMutation,
  useUpdateDischargeMutation,
} = patientApi;
