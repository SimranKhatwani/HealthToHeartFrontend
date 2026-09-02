import { Pill } from "lucide-react";
import { useGetInventoryQuery } from "../../redux/slices/inventorySlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const InventoryAlerts = () => {
  const { t } = useTranslation();
  const { data: inventoryData } = useGetInventoryQuery();
  const { mode } = useSelector((state) => state.theme);

  const colorMap = {
    "Low Stock": {
      color: "bg-rose-100",
      bgcolor: "bg-rose-50",
      darkbgcolor: "bg-rose-900",
      darkbgcolor2: "bg-rose-800",
      text: "text-rose-300",
    },
    "In Stock": {
      color: "bg-amber-100",
      bgcolor: "bg-amber-50",
      darkbgcolor: "bg-amber-900",
      darkbgcolor2: "bg-amber-800",
      text: "text-amber-300",
    },
    "Out of Stock": {
      color: "bg-green-100",
      bgcolor: "bg-green-50",
      darkbgcolor: "bg-green-900",
      darkbgcolor2: "bg-green-800",
      text: "text-green-300",
    },
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      style={{
        backgroundColor: mode === "dark" && "#020817",
        color: mode === "dark" && "white",
      }}
    >
      <h2 className="text-2xl font-bold">{t("dashboard.inventoryAlerts", "Inventory Alerts")}</h2>
      <p className="text-sm text-gray-500 mb-4 font-medium">{t("dashboard.criticalSuppliesStatus", "Critical supplies status")}</p>

      <div className="space-y-4">
        {inventoryData?.data.map((invent, index) => {
          const alertStyle = colorMap[invent.status] || {
            color: "bg-gray-100",
            bgcolor: "bg-gray-50",
            darkbgcolor: "bg-gray-800",
            darkbgcolor2: "bg-gray-700",
            text: "text-gray-300",
          };

          return (
            <div
              key={index}
              className={`flex justify-between items-center p-4 rounded-lg ${
                mode === "dark" ? alertStyle.darkbgcolor : alertStyle.bgcolor
              }`}
            >
              <div className="flex items-center gap-4">
                <Pill className={`${mode === "dark" ? alertStyle.darkbgcolor2 : alertStyle.color} w-8 h-8 p-2 rounded-full`} />
                <div>
                  <p className="font-medium">{invent.itemName}</p>
                  <p className="text-sm text-gray-500">{t(`inventory.${invent.category.toLowerCase().replace(/\s+/g, "")}`, invent.category)}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full ${mode === "dark" ? alertStyle.darkbgcolor2 : alertStyle.color} ${alertStyle.text}`}>
                {t(`status.${invent.status.toLowerCase().replace(/\s+/g, "")}`, invent.status)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryAlerts;
