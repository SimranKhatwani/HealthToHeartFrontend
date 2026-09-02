import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetDoctorsQuery } from "../redux/slices/doctorSlice";
import { useTranslation } from "react-i18next";

const AppointmentForm = () => {
    const { t } = useTranslation();
    const { data, error, isLoading, isFetching, isSuccess, isError } = useGetDoctorsQuery();
    const [doctors, setDoctors] = useState(data?.data || []);
    const [schedules, setSchedules] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [formData, setFormData] = useState({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
    });
    const apiUrl = import.meta.env.VITE_API_URL;

    // Fetch doctors
    useEffect(() => {
        if (data) {
            setDoctors(data.data.filter((doctor) => doctor?.role_id?.role_name === t('translation:doctor')));
        }
    }, [data]);

    // Fetch schedules when doctor changes
    useEffect(() => {
        if (selectedDoctor) {
            axios.get(`http://localhost:5000/schedules/doctor/${selectedDoctor}`)
                .then(response => setSchedules(response.data.data));
        }
    }, [selectedDoctor]);

    // Update time slots when schedule changes
    useEffect(() => {
        if (selectedSchedule) {
            const schedule = schedules.find(sch => sch._id === selectedSchedule);
            if (schedule) {
                setTimeSlots(schedule.timeSlots);
            }
        }
    }, [selectedSchedule, schedules]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                doctorId: selectedDoctor,
                scheduleId: selectedSchedule,
                appointmentDate,
                timeSlot: selectedTime,
                ...formData
            };

            const response = await axios.post("http://localhost:5000/appointments/book", appointmentData);
            alert(response.data.message);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert(t("appointments.bookError", "Failed to book appointment"));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">{t("appointments.bookAppointment", "Book an Appointment")}</h2>
            <form onSubmit={handleSubmit}>
                {/* Doctor Selection */}
                <div className="grid gap-3">
                    <label htmlFor="doctorId" className="text-gray-700 font-medium">{t("doctors.doctor", t('translation:doctor'))}</label>
                    <select
                        name="doctorId"
                        value={selectedDoctor?._id}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
                    >
                        <option value="">{t("appointments.selectDoctor", "Select doctor")}</option>
                        {doctors
                            .filter((doc) => doc.status === "active")
                            .map((doctor) => (
                                <option key={doctor?._id} value={doctor?._id}>
                                    {doctor.id}{" - "}{doctor.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Select Schedule */}
                <label className="block mb-2 font-medium">{t("appointments.availableSlots", "Available Slots:")}</label>
                <select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                >
                    <option value="">{t("appointments.selectSlot", "-- Select Available Slot --")}</option>
                    {schedules.map(schedule => (
                        <option key={schedule._id} value={schedule._id}>
                            {schedule.date} ({schedule.startTime} - {schedule.endTime})
                        </option>
                    ))}
                </select>

                {/* Select Date */}
                <label className="block mb-2 font-medium">{t("appointments.appointmentDate", "Appointment Date:")}</label>
                <DatePicker
                    selected={appointmentDate}
                    onChange={(date) => setAppointmentDate(date)}
                    className="w-full border p-2 rounded mb-4"
                    minDate={new Date()}
                    required
                />

                {/* Select Time Slot */}
                <label className="block mb-2 font-medium">{t("appointments.timeSlot", "Time Slot:")}</label>
                <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                >
                    <option value="">{t("appointments.selectTimeSlot", "-- Select Time Slot --")}</option>
                    {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>

                {/* Patient Name */}
                <label className="block mb-2 font-medium">{t("common.name", "Your Name:")}</label>
                <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                {/* Patient Email */}
                <label className="block mb-2 font-medium">{t("common.email", "Email:")}</label>
                <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                {/* Patient Phone */}
                <label className="block mb-2 font-medium">{t("common.phone", "Phone Number:")}</label>
                <input
                    type="text"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    {t("appointments.bookAppointment", "Book Appointment")}
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;
