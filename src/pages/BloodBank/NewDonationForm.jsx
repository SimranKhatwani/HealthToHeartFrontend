import React, { useState } from "react";
import { useCreateBloodDonationMutation } from "../../redux/slices/bloodBankSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useOutsideClick } from "../../components/hooks/useOutsideClick";
import { useTranslation } from "react-i18next";

const NewDonationForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [createBloodDonation, { isLoading }] = useCreateBloodDonationMutation();
  const { mode } = useSelector((state) => state.theme);
  const [donationData, setDonationData] = useState({
    donorName: "",
    bloodType: "",
    unitsDonated: 1,
    contact: "",
    hospital: "",
    donationDate: new Date().toISOString().split("T")[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonationData((prev) => ({
      ...prev,
      [name]: name === "unitsDonated" ? Number(value) : value
    }));
  };

  const ref = useOutsideClick(() => {
    onClose();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBloodDonation(donationData).unwrap();
      toast.success(t("bloodBank.donationSuccess", "Blood donation recorded successfully!"));
      onClose();
    } catch (err) {
      alert(t("bloodBank.donationError", "Failed to record blood donation. Please try again."));
    }
  };

  return (
    <div
      ref={ref}
      className={`max-w-xl mx-auto p-6 ${
        mode === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      } rounded-lg shadow-md`}
    >
      <h1 className="text-2xl font-bold mb-4">{t("bloodBank.recordNewDonation", "Record New Blood Donation")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("bloodBank.donorName", "Donor Name")}
            </label>
            <input
              type="text"
              name="donorName"
              value={donationData.donorName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
              placeholder={t("bloodBank.enterDonorName", "Enter donor's full name")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("patients.bloodType", "Blood Type")}
            </label>
            <select
              name="bloodType"
              value={donationData.bloodType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("bloodBank.unitsDonated", "Units Donated")}
            </label>
            <input
              type="number"
              name="unitsDonated"
              min="1"
              value={donationData.unitsDonated}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
              placeholder={t("bloodBank.enterUnits", "Enter units")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("common.phone", "Contact Number")}
            </label>
            <input
              type="text"
              name="contact"
              value={donationData.contact}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
              placeholder={t("bloodBank.enterContact", "Enter donor's contact")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("bloodBank.hospital", "Hospital / Clinic")}
            </label>
            <input
              type="text"
              name="hospital"
              value={donationData.hospital}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
              placeholder={t("bloodBank.enterHospital", "Enter hospital name")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("common.date", "Donation Date")}
            </label>
            <input
              type="date"
              name="donationDate"
              value={donationData.donationDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 bg-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md disabled:bg-gray-400"
          >
            {isLoading ? t("common.loading", "Recording...") : t("bloodBank.recordDonation", "Record Donation")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDonationForm;
