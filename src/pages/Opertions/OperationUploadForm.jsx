import React, { useState } from "react";
import { useCreateOperationMutation } from "../../redux/slices/operationSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useOutsideClick } from "../../components/hooks/useOutsideClick";
import {socket} from "../../components/hooks/useInitSocket";
import { useCreateNotificationsMutation, useGetAllNotificationsQuery } from "../../redux/slices/notificationSlice";
import { useFetchLoggedInUserQuery } from "../../redux/slices/authSlice"
import { useGetDoctorsQuery } from "../../redux/slices/doctorSlice"
import { useGetPatientsQuery } from "../../redux/slices/patientSlice"
import { useTranslation } from "react-i18next";

const OperationUploadForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [createOperation, { isLoading, isError, isSuccess }] = useCreateOperationMutation();
  const { mode } = useSelector((state) => state.theme);
  const [createNotification] = useCreateNotificationsMutation();
  const { data: logInUser } = useFetchLoggedInUserQuery();
  const { data : doctors } = useGetDoctorsQuery();
  const { data : patients } = useGetPatientsQuery();
  const [operationDetails, setOperationDetails] = useState({
    doctor_name: "",  
    patient_name: "",
    operationType: "",
    operationDate: "", 
    operationRoom: "",
    anesthesiaType: "",
    duration: "",   
    status: "Scheduled",
    notes: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOperationDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createOperation(operationDetails).unwrap();
      toast.success(t("operations.scheduleSuccess", "Operation scheduled successfully!"));
      if(response.success === true){
        socket.emit("operation-scheduled", {
          to: response.data.doctor_details[0],
          message: "Operation assigned to you",
          date: new Date(),
          notDesc: response.data.operationDate
        })

        await createNotification({
          sender: logInUser._id,
          receiver: response.data.doctor_details[0],
          message: "An operation has been scheduled for you.",
          notDesc: response.data.operationDate,
        });
      }
      
      setOperationDetails({
        doctor_name: "",
        patient_name: "",
        operationType: "",
        operationDate: "",
        operationRoom: "",
        anesthesiaType: "",
        duration: "",
        status: "Scheduled",
        notes: ""
      });

      onClose();
    } catch (error) {
      toast.error(t("operations.scheduleError", "Failed to schedule operation."));
    }
  };

  const ref = useOutsideClick(() => {
    onClose()
  });

  return (
    <div className="p-6" ref={ref}>
      <h2 className="text-xl font-bold mb-4">{t("operations.scheduleNewOperation", "Schedule New Operation")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("operations.details", "Operation Details")}</h3>

            <div className="mb-4">
              <label className="block font-medium">{t("operations.type", "Operation Type:")}</label>
              <select
                name="operationType"
                value={operationDetails.operationType}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">{t("operations.selectType", "Select type")}</option>
                <option value="Lungs">{t("operations.lungs", "Lungs")}</option>
                <option value="Heart">{t("operations.heart", "Heart")}</option>
                <option value="Brain">{t("operations.brain", "Brain")}</option>
                <option value="Kidney">{t("operations.kidney", "Kidney")}</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="doctor_name" className="text-gray-700 font-medium">{t("doctors.doctor", "Doctor")}</label>
                    <select
                        name="doctor_name"
                        value={operationDetails?.doctor_name}
                        required
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
                    >
                        <option value="">{t("operations.selectDoctor", "Select doctor")}</option>
                        {doctors?.data
                            ?.filter((doc) => doc?.status === "active" && doc?.role_id?.role_name === 'Doctor')
                            ?.map((doctor) => (
                                <option key={doctor?._id} value={doctor?.name}>
                                    {doctor.id}{" - "}{doctor.name}
                                </option>
                            ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">{t("appointments.patient", "Patient Name:")}</label>
              <select
                name="patient_name"
                value={operationDetails.patient_name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">{t("operations.selectPatient", "Select patient")}</option>
                {patients?.data?.map((patient) => (
                    <option key={patient?._id} value={patient?.name}>
                        {patient.id}{" - "}{patient.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">{t("operations.room", "Operation Room:")}</label>
              <select
                name="operationRoom"
                value={operationDetails.operationRoom}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">{t("operations.selectRoom", "Select room")}</option>
                <option value="Standard">{t("rooms.standard", "Standard")}</option>
                <option value="Deluxe">{t("rooms.deluxe", "Deluxe")}</option>
                <option value="Premium">{t("rooms.premium", "Premium")}</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("operations.schedule", "Schedule")}</h3>
            <div className="mb-4">
              <label className="block font-medium">{t("common.date", "Operation Date:")}</label>
              <input
                type="date"
                name="operationDate"
                value={operationDetails.operationDate}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">{t("operations.duration", "Duration (minutes):")}</label>
              <input
                type="number"
                name="duration"
                value={operationDetails.duration}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">{t("operations.anesthesiaType", "Anesthesia Type:")}</label>
              <select
                name="anesthesiaType"
                value={operationDetails.anesthesiaType}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">{t("operations.selectAnesthesia", "Select Anesthesia")}</option>
                <option value="Local">{t("operations.local", "Local")}</option>
                <option value="General">{t("operations.general", "General")}</option>
                <option value="Regional">{t("operations.regional", "Regional")}</option>
                <option value="None">{t("common.none", "None")}</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium">{t("operations.notes", "Notes:")}</label>
              <textarea
                name="notes"
                value={operationDetails.notes}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-md ${
              mode === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600`}
            disabled={isLoading}
          >
            {isLoading ? t("common.loading", "Scheduling...") : t("operations.scheduleOperation", "Schedule Operation")}
          </button>
        </div>

        {isError && <p className="text-red-500 mt-2">{t("operations.scheduleError", "Failed to schedule operation.")}</p>}
        {isSuccess && <p className="text-green-500 mt-2">{t("operations.scheduleSuccess", "Operation scheduled successfully!")}</p>}
      </form>
    </div>
  );
};

export default OperationUploadForm;
