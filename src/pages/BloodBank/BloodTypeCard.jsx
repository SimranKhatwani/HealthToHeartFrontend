import React from "react";
import { Droplet } from "lucide-react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { translateValue } from '../../utilis/translate';

function BloodTypeCard({ data }) {
  const { t } = useTranslation();
  const { mode } = useSelector((state) => state.theme)
  
  const getStatusColor = () => {
    switch (data.status) {
      case "critical":
        return mode === "light" ? "text-rose-500" : "text-rose-400";
      case "low":
        return mode === "light" ? "text-amber-500" : "text-amber-400"; 
      case "normal":
      default:
        return mode === "light" ? "text-teal-500" : "text-teal-400";
    }
  }

  const getProgressColor = () => {
    switch (data.status) {
      case "critical":
        return "bg-red-500";
      case "low":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`bg-teal-100 text-teal-500 p-2 rounded-full  ${mode === "light" ? "bg-teal-100 text-teal-500 hover:bg-teal-700" : "bg-teal-900 text-teal-300 hover:bg-teal-800"}`}>
            <Droplet className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">{data.bloodType}</h3>
        </div>
        <span className={`capitalize font-medium ${getStatusColor()}`}>{t(`bloodBank.${translateValue('status', data.status, t)}`, data.status)}</span>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-500">{t("bloodBank.availableUnits", "Available Units:")} {data.units} </p>
      </div>

      {/* <ProgressPrimitive.Root
        className="relative h-4 w-full bg-gray-200 rounded-full"
        value={percentage}
      > */}
        {/* <ProgressPrimitive.Indicator
          className={`h-full ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        /> */}
      {/* </ProgressPrimitive.Root> */}
    </div>
  );
}

export default BloodTypeCard