import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

const DoctorForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    department: "",
    specialization: "",
    degree: "",
    experience: "",
    description: "",
    password: "",
    confirmPassword: "",
    schedule: [],
  });

  const [newSchedule, setNewSchedule] = useState({
    day: "",
    startTime: "",
    endTime: "",
    slots: [],
  });

  const departments = ["Cardiology", "Dermatology", "Orthopedics", "Neurology"];

  // Handle input changes
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // Handle schedule change
  const handleScheduleChange = (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  // Add a new schedule
  const addSchedule = () => {
    if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
      setDoctor({ ...doctor, schedule: [...doctor.schedule, newSchedule] });
      setNewSchedule({ day: "", startTime: "", endTime: "", slots: [] });
    } else {
      alert(t('translation:pleaseFillInAllScheduleFields'));
    }
  };

  // Remove schedule
  const removeSchedule = (index) => {
    const updatedSchedule = doctor.schedule.filter((_, i) => i !== index);
    setDoctor({ ...doctor, schedule: updatedSchedule });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (doctor.password !== doctor.confirmPassword) {
      alert(t('translation:passwordsDoNotMatch'));
      return;
    }
    onSubmit(doctor);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">{t('translation:doctorRegistration')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <input type="text" name="name" placeholder={t('translation:name')} value={doctor.name} onChange={handleChange} className="input" required />
        <input type="email" name="email" placeholder={t('translation:email')} value={doctor.email} onChange={handleChange} className="input" required />
        <input type="text" name="phoneNo" placeholder={t('translation:phoneNo')} value={doctor.phoneNo} onChange={handleChange} className="input" required />
        <textarea name="address" placeholder={t('translation:address')} value={doctor.address} onChange={handleChange} className="input" required />

        {/* Professional Details */}
        <select name="department" value={doctor.department} onChange={handleChange} className="input">
          <option value="">{t('translation:selectDepartment')}</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>
        <input type="text" name="specialization" placeholder={t('translation:specialization')} value={doctor.specialization} onChange={handleChange} className="input" />
        <input type="text" name="degree" placeholder={t('translation:degree')} value={doctor.degree} onChange={handleChange} className="input" />
        <input type="number" name="experience" placeholder={t('translation:experienceYears')} value={doctor.experience} onChange={handleChange} className="input" />
        <textarea name="description" placeholder={t('translation:description')} value={doctor.description} onChange={handleChange} className="input" />

        {/* Password */}
        <input type="password" name="password" placeholder={t('translation:password')} value={doctor.password} onChange={handleChange} className="input" required />
        <input type="password" name="confirmPassword" placeholder={t('translation:confirmPassword')} value={doctor.confirmPassword} onChange={handleChange} className="input" required />

        {/* Schedule Management */}
        <h3 className="text-lg font-bold">{t('translation:schedule')}</h3>
        <div className="grid grid-cols-3 gap-2">
          <select name="day" value={newSchedule.day} onChange={handleScheduleChange} className="input">
            <option value="">{t('translation:selectDay')}</option>
            {[t('translation:monday'), t('translation:tuesday'), t('translation:wednesday'), t('translation:thursday'), t('translation:friday'), t('translation:saturday'), t('translation:sunday')].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input type="time" name="startTime" value={newSchedule.startTime} onChange={handleScheduleChange} className="input" />
          <input type="time" name="endTime" value={newSchedule.endTime} onChange={handleScheduleChange} className="input" />
        </div>
        <button type="button" onClick={addSchedule} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">{t('translation:addSchedule')}</button>

        {/* Show Added Schedules */}
        {doctor.schedule.length > 0 && (
          <ul className="mt-3">
            {doctor.schedule.map((sched, index) => (
              <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md mt-2">
                {sched.day}: {sched.startTime} - {sched.endTime}
                <button type="button" onClick={() => removeSchedule(index)} className="text-red-500">X</button>
              </li>
            ))}
          </ul>
        )}

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">{t('translation:registerDoctor')}</button>
      </form>
    </div>
  );
};

export default DoctorForm;
