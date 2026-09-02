import { useEffect, useState } from "react";
import { BarChart4, Calendar, Users, Bed, Activity, Pill, Stethoscope, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Clock, UserCheck, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import FinancialOverview from "../components/DashboardWidgets/FinancialOverview"
import PatientPortal from "../components/DashboardWidgets/PatientPortal";
import Appointments from "../components/DashboardWidgets/Appointments";
import DepartmentStatus from "../components/DashboardWidgets/DepartmentStatus";
import InventoryAlerts from "../components/DashboardWidgets/InventortAlert";
import Header from "../components/Header";
import { useGetPatientsQuery } from "../redux/slices/patientSlice";
import { useGetAppointmentsQuery } from "../redux/slices/appointmentsSlice";
import { useGetAllOperationsQuery } from "../redux/slices/operationSlice";
import { useGetRoomsQuery } from "../redux/slices/roomSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { useGetRolePermissionsQuery } from "../redux/slices/roleSlice";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [showReports, setShowReports] = useState(false);
  const { data: patientsData, error, isLoading } = useGetPatientsQuery();
  const { data: appointmentData } = useGetAppointmentsQuery();
  const { data: operationsData } = useGetAllOperationsQuery();
  const { data: roomsData } = useGetRoomsQuery();
  const { data : permissionsData } = useGetRolePermissionsQuery();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { mode } = useSelector((state) => state.theme);
  const { role } = useSelector((state) => state.role);

const showFinancialOverview = role === "admin" || role === "superadmin";
const showAppointments = role === "admin" || role === "superadmin" || role === "Receptionist"

const firstGridCols = showFinancialOverview ? "lg:grid-cols-2" : "lg:grid-cols-1";
const secondGridCols = [showAppointments, true, true].filter(Boolean).length; // total visible items
const secondGridClass = `lg:grid-cols-${secondGridCols}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen"
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <div className="flex gap-2">
          {/* <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-100" onClick={() => setShowReports(!showReports)}>
            <BarChart4 className="h-4 w-4" />
            Reports
          </button> */}
          {/* <button className={`flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-md text-sm ${mode === "dark" ? "bg-teal-900 hover:bg-teal-800 text-black" : "text-white"}`}>
            <Calendar className="h-4 w-4" />
            Schedule
          </button> */}
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { icon: <Users />, label: t("dashboard.totalPatients"), value: patientsData?.data.length, change: "12%", color: mode === "dark" ? "bg-blue-800" : "bg-blue-300",bgColor: mode === "dark" ? "#020817" : "bg-blue-100"},
          { icon: <Calendar />, label: t("navigation.appointments"), value: appointmentData?.data.length, change: "8%", color: mode === "dark" ? "bg-teal-800" :"bg-teal-300", bgColor: mode === "dark" ? "#020817" : "bg-teal-100" },
          { icon: <Bed />, label: t("dashboard.bedOccupancy", "Bed Occupancy"), value: roomsData?.data.length, change: "-3%", color: mode === "dark" ? "bg-amber-800" : "bg-amber-300", bgColor: mode === "dark" ? "#020817" : "bg-amber-100" },
          { icon: <Activity />, label: t("navigation.operations"), value: operationsData?.data.length, change: "5%", color: mode === "dark" ? "bg-purple-800" : "bg-purple-300", bgColor: mode === "dark" ? "#020817" : "bg-purple-100" },
        ].map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg border border-gray-200 p-6 flex items-center gap-4`}>
            <div className={`p-3 rounded-full ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{item.value}</p>
                {/* <span className={`flex items-center text-xs ml-2 ${item.change.includes('-') ? "text-red-500" : "text-green-500"}`}>
                  {item.change.includes('-') ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  {item.change}
                </span> */}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Widgets */}
      <div className={`grid grid-cols-1 gap-6 mb-6`}>
      {/* {showFinancialOverview && <FinancialOverview />} */}
      <PatientPortal />
      </div>

<div className={`grid grid-cols-1 ${secondGridClass} gap-6 mb-6`}>
  {(role === "admin" || role === "superadmin" || permissionsData?.permissionsspecial.includes("viewDashboardAppointments")) && <Appointments />}
  <DepartmentStatus />
  <InventoryAlerts />
</div>

</div>
  );
};

export default Dashboard;
