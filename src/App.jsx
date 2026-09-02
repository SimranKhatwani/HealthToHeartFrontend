import { useState, useEffect } from "react";
import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import { useSelector } from "react-redux";
import Auth from "./pages/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import Operations from "./pages/Opertions/Operations";
import DashboardPage from "./pages/DashboardPage";
import BloodBank from "./pages/BloodBank/BloodBank";
import Insurance from "./pages/Insurance";
import Inventory from "./pages/Inventory";
import Doctors from "./pages/Doctors"
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Staff from "./pages/Staff";
import Rooms from "./pages/Room/Rooms";
import Laboratory from "./pages/Laboratory";
import Pharmacy from "./pages/Pharmacy";
import MealPlans from "./pages/MealPlans";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Billing from "./pages/Billings";
import LoginPage from "./pages/PatientsSide/LoginPage";
import PatientPortal from "./pages/PatientsSide/PatientsSide";
import useInitSocket, { socket } from "./components/hooks/useInitSocket";
import AllPermission from "./pages/Permission/AllPermission";
import AllRoles from "./pages/Permission/AllRoles";
import ProtectedRoute  from "./ProtectedRoutes";
import { useTranslation } from 'react-i18next';


function App() {
  const { t } = useTranslation();
  useInitSocket();
  const { role } = useSelector((state) => state.role);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert(t('translation:permissionDeniedForNotificatio'));
        }
      }
    };
  
    const handleOperationAssigned = ({ message }) => {
      new Notification("New message", { body: message });
    };

    const handleAppointment = ({ message }) => {
      new Notification("New message", { body: message });
    };
    const handleMealPlan= ({ message }) => {
      new Notification("New message", { body: message });
    };
    const handleMessages= ({ message }) => {
      new Notification("New message", { body: message });
    };
  
  
    // Request notification permission on mount
    requestNotificationPermission();
  
    if (socket) {
      // Remove any existing event listeners before adding new ones
      socket.off("schedule-Operation");
      socket.off("schedule-appointment");
      socket.off("assign-meal-plan");
      socket.off("message-received");
  
      // Add event listeners
      socket.on("schedule-Operation", handleOperationAssigned);
      socket.on("schedule-appointment", handleAppointment);
      socket.on("assign-meal-plan", handleMealPlan);
      socket.on("message-received", handleMessages);
    }
  
    return () => {
      if (socket) {
        socket.off("schedule-Operation", handleOperationAssigned);
        socket.off("schedule-appointment", handleAppointment);
        socket.off("assign-meal-plan", handleMealPlan);
        socket.off("message-received", handleMessages);
      }
    };
  }, [socket]);

  // console.log("role", role)
  useEffect(() => {
    // if (role) {
      setRoleLoaded(true);
    // }
  }, [role]); 

  if (!roleLoaded) {
    return <div>{t('translation:loading')}</div>; // Show a loader until the role is available
  }

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    const isExpired = payload.exp * 1000 < Date.now();
  
    if (isExpired) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
  };

  checkTokenExpiry()
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: role ? <Navigate to={`/${role}/dashboard`} replace /> : <Navigate to="/login" replace />,
    },
    {
      path: "/loginpage",
      element: <LoginPage />,
    },
    { path: "patients-side", element: <PatientPortal /> },
    {
      path: "/login",
      element: <Auth />,
    },
    ...(role
      ? [
          {
            path: `/${role}/`,
            element: <Layout />,
            children: [
              { path: "", element: <DashboardPage /> },
              { path: "dashboard", element: <DashboardPage /> },
              { path: "operations", element: <Operations /> },
              { path: "blood-bank", element: <BloodBank /> },
              { path: "insurance", element: <Insurance /> },
              { path: "inventory", element: <Inventory /> },
              { path: "billing", element: <Billing /> },
              { path: "doctors", element: <Doctors /> },
              { path: "patients", element: <Patients /> },
              { path: "staff", element: <Staff /> },
              { path: "rooms", element: <Rooms /> },
              { path: "laboratory", element: <Laboratory /> },
              { path: "pharmacy", element: <Pharmacy /> },
              { path: "meal-plans", element: <MealPlans /> },
              { path: "appointments", element: <Appointments /> },
              { path: "reports", element: <Reports /> },
              { path: "roles", element: (
                <ProtectedRoute permission="SeePermissions">
                  <AllRoles />
                </ProtectedRoute>
              )},
              { path: "permissions", element: 
              (
                <ProtectedRoute permission="SeePermissions">
                  <AllPermission /> 
                </ProtectedRoute>
              )},
            ],
          },
        ]
      : []),
  ]);

  return <RouterProvider router={router} />;
}

export default App;
