import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BloodTypeCard from "./BloodTypeCard";
import BloodDonations from "./BloodDonations";
import BloodRequests from "./BloodRequests";
import { useFetchBloodBanksQuery } from "../../redux/slices/bloodBankSlice";
import Button from "../../components/UI/Button";
import { format } from "date-fns";
import { useSelector } from "react-redux"; // Importing the useSelector hook
import NewDonationForm from "./NewDonationForm";

import { useTranslation } from "react-i18next";

function BloodBank() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: bloodBanks, error, isLoading } = useFetchBloodBanksQuery();
  const { mode, color } = useSelector((state) => state.theme); // Accessing theme and color from Redux

  const donationsByTypeData = bloodBanks?.data?.reduce((acc, donation) => {
    const existing = acc.find(item => item.name === donation.bloodType);
    if (existing) {
      existing.value += donation.units;
    } else {
      acc.push({ name: donation.bloodType, value: donation.units });
    }
    return acc;
  }, []) || [];

  const donationTrendData = useMemo(() => {
    if (!bloodBanks?.data) return [];

    const monthlyCountMap = {};

    bloodBanks.data.forEach((donation) => {
      const month = format(new Date(donation.addedDate), "MMM"); 
      monthlyCountMap[month] = (monthlyCountMap[month] || 0) + 1;
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthOrder
      .map((month) => ({
        month,
        donations: monthlyCountMap[month] || 0,
      }))
      .filter((entry) => entry.donations > 0); 
  }, [bloodBanks]);

  const COLORS = ["#00a19d", "#26c6c2", "#66d9d6", "#b3eceb", "#008f8b", "#007e7a", "#006c68", "#005a58"];

  return (
    <div className="flex flex-col justify-between gap-4 mb-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("bloodBank.title")}</h1>
        <Button className={`px-4 py-2 rounded flex items-center cursor-pointer `} onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("bloodBank.newDonation")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {bloodBanks?.data?.map((item, i) => (
          <BloodTypeCard key={item.bloodType || i} data={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donation Statistics */}
        <div className={`bg-white shadow-lg p-4 rounded-lg border ${mode === "light" ? "border-gray-300" : "border-gray-700"}`}
        style={{
          backgroundColor: mode === "dark" && "#020817",
          color: mode === "dark" && "white",
          }}>
          <h2 className="text-lg font-bold mb-4">{t("bloodBank.donationsByType")}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  data={donationsByTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {donationsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donation Trends */}
        <div className={`bg-white shadow-lg p-4 rounded-lg border ${mode === "light" ? "border-gray-300" : "border-gray-700"}`}
        style={{
          backgroundColor: mode === "dark" && "#020817",
          color: mode === "dark" && "white",
          }}>
          <h2 className="text-lg font-bold mb-4">{t("bloodBank.donationTrends")}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#00a19d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BloodDonations />
        <BloodRequests />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">  
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <NewDonationForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BloodBank;
