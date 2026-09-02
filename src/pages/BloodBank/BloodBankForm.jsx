import React, { useState } from 'react';
import { useCreateBloodBankMutation } from "../../redux/slices/bloodBankSlice";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import { useOutsideClick } from "../../components/hooks/useOutsideClick"; 
import { translateValue } from '../../utilis/translate';
import { useTranslation } from 'react-i18next';

const BloodBankForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [createBloodBank, { isLoading, error }] = useCreateBloodBankMutation();
  const { mode } = useSelector((state) => state.theme);
  const [requestData, setRequestData] = useState({
    bloodType: "",
    units: 0,
    addedDate: "",
    expiryDate: "",
    status: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ref = useOutsideClick(() => {
      onClose();
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBloodBank(requestData).unwrap();
      toast.success(t('translation:bloodDetailsUploadedSuccessful'));
      setRequestData({
        bloodType: "",
        units: 0 ,
        addedDate: "",
        expiryDate: "",
        status: ""
      });
      onClose();
    } catch (err) {
      // console.error("Failed to submit blood request", err);
      alert(t('translation:failedToUploadBloodDetailsPlea'));
    }
  };

  return (
    <div ref={ref} className={`max-w-xl mx-auto p-6 ${mode === "dark" ? "bg-black" : "bg-white"} rounded-lg shadow-md`}>
      <h1 className="text-2xl font-bold mb-4">{t('translation:uploadBloodDetails')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('translation:bloodType')}</label>
            <select
              name="bloodType"
              value={requestData.bloodType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t('translation:selectBloodType')}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('translation:units')}</label>
            <input
              type="number"
              name="units"
              min="1"
              value={requestData.units}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
              placeholder={t('translation:enterNumberOfUnits')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('translation:addedDate')}</label>
            <input
              type="date"
              name="addedDate"
              value={requestData.addedDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('translation:expiryDate')}</label>
            <input
              type="date"
              name="expiryDate"
              value={requestData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('translation:status')}</label>
            <select
              name="status"
              value={translateValue('status', requestData.status, t)}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t('translation:selectStatus')}</option>
              <option value="available">{t('translation:available')}</option>
              <option value="low">{t('translation:low')}</option>
              <option value="out">{t('translation:out')}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
          >{t('translation:cancel')}</button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-2">Failed to submit: {error.message}</p>}
    </div>
  );
};

export default BloodBankForm;
