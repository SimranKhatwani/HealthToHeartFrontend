import React, { useState } from 'react';
import { useCreateBloodRequestMutation } from "../../redux/slices/bloodBankSlice";
import { useGetPatientsQuery } from "../../redux/slices/patientSlice";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { useOutsideClick } from '../../components/hooks/useOutsideClick';
import { useTranslation } from "react-i18next";
import { translateValue } from '../../utilis/translate';

const NewRequestForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [createBloodRequest] = useCreateBloodRequestMutation();
  const { data: patients } = useGetPatientsQuery();
  const [requestData, setRequestData] = useState({
    patientName: "",
    bloodType: "",
    unitsRequested: 1,
    requestDate: "",
    status: "",
    urgency: "",
    contact: ""
  });

  const ref = useOutsideClick(() => {
    onClose();
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createBloodRequest(requestData).unwrap();
      toast.success(t('translation:bloodRequestUploadedSuccessful'));
      
      // Reset form after submission
      setRequestData({
        patientName: "",
        bloodType: "",
        unitsRequested: 0,
        requestDate: "",
        status: "",
        urgency: "",
        contact: ""
      });
      
      onClose(); // Close the form after submission
    } catch (error) {
      alert(`Failed to submit blood request: ${error?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6rounded-lg shadow-md" ref={ref}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("bloodBank.newRequest", "New Blood Request")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.patientName", "Patient Name")}
            </label>
            <select
              name="patientName"
              value={requestData.patientName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t("operations.selectPatient", "Select patient")}</option>
              {patients?.data?.map((patient) => (
                  <option key={patient?._id} value={patient?.name}>
                      {patient.id}{" - "}{patient.name}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("bloodBank.bloodType", "Blood Type")}
            </label>
            <select
              name="bloodType"
              value={requestData.bloodType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t("bloodBank.selectBloodType", "Select Blood Type")}</option>
              <option value="A+">{t('translation:a')}</option>
              <option value="A-">{t('translation:a')}</option>
              <option value="B+">{t('translation:b')}</option>
              <option value="B-">{t('translation:b')}</option>
              <option value="AB+">{t('translation:ab')}</option>
              <option value="AB-">{t('translation:ab')}</option>
              <option value="O+">{t('translation:o')}</option>
              <option value="O-">{t('translation:o')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("bloodBank.requestDate", "Request Date")}
            </label>
            <input
              type="date"
              name="requestDate"
              value={requestData.requestDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.contactInfo", "Contact Information")}
            </label>
            <input
              type="text"
              name="contact"
              value={requestData.contact}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={t("bloodBank.enterContact", "Enter contact information")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("bloodBank.unitsRequested", "Units Requested")}
            </label>
            <input
              type="number"
              name="unitsRequested"
              min="1"
              max="10"
              value={requestData.unitsRequested}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("bloodBank.urgency", "Urgency")}
              </label>
              <select
                name="urgency"
                value={requestData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("bloodBank.selectUrgency", "Select Urgency")}</option>
                <option value="normal">{t("bloodBank.normal", "Normal")}</option>
                <option value="urgent">{t("bloodBank.urgent", "Urgent")}</option>
                <option value="critical">{t("bloodBank.critical", "Critical")}</option>
              </select>
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("common.status", "Status")}
            </label>
            <select
              name="status"
              value={translateValue('status', requestData.status, t)}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t("bloodBank.selectStatus", "Select Status")}</option>
              <option value="pending">{t("status.pending", "Pending")}</option>
              <option value="fulfilled">{t("status.approved", "Approved")}</option>
              <option value="rejected">{t("status.rejected", "Rejected")}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {t("bloodBank.submitRequest", "Submit Request")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequestForm;
