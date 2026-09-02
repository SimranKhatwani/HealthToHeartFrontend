import React, { useState } from "react";
import { BarChart4, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const FinancialOverview = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("week");
  const { mode } = useSelector((state) => state.theme);

  const financialData = {
    today: {
      revenue: 2450,
      expenses: 850,
      profit: 1600,
      percentChange: 12.5,
    },
    week: {
      revenue: 15800,
      expenses: 5200,
      profit: 10600,
      percentChange: 8.3,
    },
    month: {
      revenue: 68500,
      expenses: 22300,
      profit: 46200,
      percentChange: 15.7,
    },
    quarter: {
      revenue: 195000,
      expenses: 65000,
      profit: 130000,
      percentChange: 10.2,
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200"
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.financialOverview", "Financial Overview")}</h2>
          <p className="text-gray-500">{t("dashboard.financialOverviewSub", "Revenue, expenses, and profit metrics")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {Object.keys(financialData).map((period) => (
          <button
            key={period}
            onClick={() => setActiveTab(period)}
            className={`px-2 py-2 text-sm font-medium ${
              activeTab === period
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t(`dashboard.${period}`, period.charAt(0).toUpperCase() + period.slice(1))}
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue */}
          <div className="rounded-lg p-2 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <DollarSign className="h-6 w-6 text-green-500 bg-green-100 rounded-full p-1"/>
              </div>
              <div className="text-green-600 text-xs flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {financialData[activeTab].percentChange}%
              </div>
            </div>
            <p className="text-xl font-bold mt-4 flex flex-col">
              <span className="text-lg font-semibold text-gray-500">{t("billing.revenue", "Revenue")}</span>
              {formatCurrency(financialData[activeTab].revenue)}
            </p>
          </div>

          {/* Expenses */}
          <div className="rounded-lg p-2 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <ArrowDownRight className="h-6 w-6 text-rose-500 bg-rose-100 rounded-full p-1"/>
              </div>
              <div className="text-rose-600 text-sm">{t("billing.expenses", "Expenses")}</div>
            </div>
            <p className="text-xl font-bold mt-4 flex flex-col">
            <span className="text-lg font-semibold text-gray-500">{t("billing.expenses", "Expenses")}</span>
              {formatCurrency(financialData[activeTab].expenses)}
            </p>
          </div>

          {/* Profit */}
          <div className="rounded-lg p-2 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-blue-500 bg-blue-100 rounded-full p-1"/>
              </div>
              <div className="text-blue-600 text-sm">{t("billing.netProfit", "Net Profit")}</div>
            </div>
            <p className="text-xl font-bold mt-4 flex flex-col">
            <span className="text-lg font-semibold text-gray-500">{t("billing.profit", "Profit")}</span>
              {formatCurrency(financialData[activeTab].profit)}
            </p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-6 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <BarChart4 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {t("dashboard.chartVisualization", "Financial chart visualization would appear here")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
