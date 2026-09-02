import { configureStore } from "@reduxjs/toolkit";
import { operationsApi } from "./slices/operationSlice";
import roleReducer from "./slices/rolesSlices";
import { doctorApi } from "./slices/doctorSlice";  
import { inventoryApi } from "./slices/inventorySlice"
import { scheduleApi } from "./slices/schedule"
import { apiSlice } from "./slices/authSlice"
import { shiftApi } from "./slices/shiftSlice";
import { patientApi } from "./slices/patientSlice"
import { appointmentsApi } from "./slices/appointmentsSlice"
import { insuranceApi } from "./slices/insuranceSlice";
import { bloodBankApi } from "./slices/bloodBankSlice"
import { prescriptionApi } from "./slices/prescriptionSlice";
import { roleApi } from "./slices/roleSlice";
import { mealPlanApi } from "./slices/mealPlanSlice";
import { RoomApi } from "./slices/roomSlice";
import themeReducer from "./slices/themeSlice"
import socketReducer from "./slices/socketSlice"
import { labTestApi } from "./slices/labTestSlice";
import { labReportApi } from "./slices/labReportSlice";
import { reportApi } from "./slices/reportsSlice";
import { aiDiagnosticApi } from "./slices/aiDiagnosticSlice";
import { notificationsApi } from "./slices/notificationSlice"
import { messageApi } from "./slices/messageSlice";
import { permissionsApi } from "./slices/permissionSlice";
import { organizationApi } from "./slices/organizationSlice";

const store = configureStore({
  reducer: {
    [operationsApi.reducerPath]: operationsApi.reducer,
    [bloodBankApi.reducerPath]: bloodBankApi.reducer,
    role: roleReducer,
    theme: themeReducer,
    socket: socketReducer,
    [doctorApi.reducerPath]: doctorApi.reducer, 
    [inventoryApi.reducerPath]: inventoryApi.reducer, 
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer, 
    [appointmentsApi.reducerPath]: appointmentsApi.reducer, 
    [insuranceApi.reducerPath]: insuranceApi.reducer,
    [prescriptionApi.reducerPath]: prescriptionApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [mealPlanApi.reducerPath]: mealPlanApi.reducer,
    [labTestApi.reducerPath]: labTestApi.reducer,
    [labReportApi.reducerPath]: labReportApi.reducer,
    [RoomApi.reducerPath]: RoomApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [aiDiagnosticApi.reducerPath]: aiDiagnosticApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      doctorApi.middleware,
      inventoryApi.middleware, 
      scheduleApi.middleware, 
      operationsApi.middleware, 
      apiSlice.middleware, shiftApi.middleware,
      patientApi.middleware,
      appointmentsApi.middleware,
      insuranceApi.middleware,
      bloodBankApi.middleware,
      prescriptionApi.middleware,
      roleApi.middleware,
      mealPlanApi.middleware,
      labTestApi.middleware,
      labReportApi.middleware,
      RoomApi.middleware,
      reportApi.middleware,
      mealPlanApi.middleware,
      aiDiagnosticApi.middleware,
      RoomApi.middleware,
      notificationsApi.middleware,
      messageApi.middleware,
      permissionsApi.middleware,
      organizationApi.middleware,
    ),  
});

export default store;
