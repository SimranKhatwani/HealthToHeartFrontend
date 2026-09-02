import ProgressBar from "./ProgressBar";
import { Stethoscope, Bed, Activity, Pill, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetRoomsQuery } from "../../redux/slices/roomSlice";
import { useTranslation } from "react-i18next";

const DepartmentStatus = () => {
  const { t } = useTranslation();
  const { data: roomData } = useGetRoomsQuery();
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <h2 className="text-2xl font-bold">{t("dashboard.roomStatus", "Room Status")}</h2>
      <p className="text-sm text-gray-500 mb-4 font-medium">{t("dashboard.roomCapacity", "Current room capacity")}</p>

      <div className="space-y-4">
        {roomData?.data.map((room, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 flex items-center justify-center ${room.iconColor}`}>
                  {room.icon}
                </div>
                <span>{t(`rooms.${room.roomType.toLowerCase().replace(/\s+/g, "").replace("-", "")}`, room.roomType)}</span>
              </div>
              <span className="text-sm font-medium">{room.occupiedBedsCount}%</span>
            </div>
            <ProgressBar value={room.occupiedBedsCount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentStatus;
