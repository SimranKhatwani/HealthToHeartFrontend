import React, { useState } from 'react';
import { useCreateRoomsMutation } from '../../redux/slices/roomSlice';
import { toast } from 'react-toastify';
import { useOutsideClick } from '../../components/hooks/useOutsideClick';
import { useTranslation } from "react-i18next";

const AddRoomForm = ({setShowAddRoomForm}) => {
  const { t } = useTranslation();
  const [createRoom, { isLoading }] = useCreateRoomsMutation();
  const [formData, setFormData] = useState({
    room_number: '',
    room_name: '',
    bedsCount: '',
    occupiedBedsCount: '',
    roomType: '',
    roomStatus: '',
  });
  
  const ref = useOutsideClick(() => {
    setShowAddRoomForm(false);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRoom(formData).unwrap();
      toast.success(t("rooms.createSuccess", "Room created successfully!"));
      setShowAddRoomForm(false)
      setFormData({
        room_number: '',
        room_name: '',
        bedsCount: '',
        occupiedBedsCount: '',
        roomType: '',
        roomStatus: '',
      });
    } catch (error) {
      toast.error(error?.data?.message || t("rooms.createError", "Failed to create room"));
    }
  };

  return (
    <form
    ref = {ref}
    onSubmit={handleSubmit}
    className="w-full max-w-2xl p-8 mx-auto bg-white text-black rounded-2xl shadow-xl space-y-6"
    >
  <div className="space-y-1">
    <h2 className="text-2xl font-bold text-teal-600">{t("rooms.addNewRoom", "Add New Room")}</h2>
    <p className="text-sm text-gray-500">
      {t("rooms.fillDetails", "Please fill in the details below to add a new room.")}
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="room_number" className="block text-sm font-medium text-gray-700">
        {t("rooms.roomNumber", "Room Number")}
      </label>
      <input
        type="text"
        name="room_number"
        id="room_number"
        value={formData.room_number}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
        required
      />
    </div>

    <div>
      <label htmlFor="room_name" className="block text-sm font-medium text-gray-700">
        {t("rooms.roomName", "Room Name")}
      </label>
      <input
        type="text"
        name="room_name"
        id="room_name"
        value={formData.room_name}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
        required
      />
    </div>

    <div>
      <label htmlFor="bedsCount" className="block text-sm font-medium text-gray-700">
        {t("rooms.bedsCount", "Beds Count")}
      </label>
      <input
        type="number"
        name="bedsCount"
        id="bedsCount"
        value={formData.bedsCount}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
      />
    </div>

    <div>
      <label htmlFor="occupiedBedsCount" className="block text-sm font-medium text-gray-700">
        {t("rooms.occupiedBeds", "Occupied Beds")}
      </label>
      <input
        type="number"
        name="occupiedBedsCount"
        id="occupiedBedsCount"
        value={formData.occupiedBedsCount}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
        required
      />
    </div>

    <div>
      <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
        {t("rooms.roomType", "Room Type")}
      </label>
      <select
        name="roomType"
        id="roomType"
        value={formData.roomType}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
        required
      >
        <option value="">{t("rooms.selectRoomType", "Select Room Type")}</option>
        <option value="General">{t('translation:general')}</option>
        <option value="Multi-Sharing Ward">{t('translation:multisharingWard')}</option>
        <option value="Semi-Private Room">{t('translation:semiprivateRoom')}</option>
        <option value="Private Room">{t('translation:privateRoom')}</option>
        <option value="Deluxe Room">{t('translation:deluxeRoom')}</option>
        <option value="Suite Room">{t('translation:suiteRoom')}</option>
        <option value="Junior Suite">{t('translation:juniorSuite')}</option>
        <option value="Super Deluxe Room">{t('translation:superDeluxeRoom')}</option>
        <option value="ICU">{t('translation:icu')}</option>
        <option value="CCU">{t('translation:ccu')}</option>
        <option value="Isolation Room">{t('translation:isolationRoom')}</option>
        <option value="Pediatric Room">{t('translation:pediatricRoom')}</option>
        <option value="Maternity Room">{t('translation:maternityRoom')}</option>
        <option value="Recovery Room">{t('translation:recoveryRoom')}</option>
      </select>
    </div>

    <div>
      <label htmlFor="roomStatus" className="block text-sm font-medium text-gray-700">
        {t("rooms.roomStatus", "Room Status")}
      </label>
      <select
        name="roomStatus"
        id="roomStatus"
        value={formData.roomStatus}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-400"
        required
      >
        <option value="">{t("rooms.selectRoomStatus", "Select Room Status")}</option>
        <option value="Available">{t("status.available", "Available")}</option>
        <option value="Occupied">{t("status.occupied", "Occupied")}</option>
      </select>
    </div>
  </div>

  <div className="flex justify-end">
    <button
      type="submit"
      disabled={isLoading}
      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-xl transition-all disabled:opacity-50"
    >
      {isLoading ? t("common.loading", "Saving...") : t("rooms.addRoom", "Add Room")}
    </button>
  </div>
    </form>

  );
};

export default AddRoomForm;
