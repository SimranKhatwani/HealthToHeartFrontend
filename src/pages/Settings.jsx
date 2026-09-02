"use client";
import { Save } from "lucide-react";

import { useTranslation } from "react-i18next";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition bg-teal-500 hover:bg-teal-600 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow rounded-lg p-6 mb-6 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div>{children}</div>;
};

export default function Settings() {
  const { t } = useTranslation();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <Button>
          <Save className="h-4 w-4" />
          {t("common.save", "Save Changes")}
        </Button>
      </div>

      <Card>
        <CardHeader
          title={t("settings.userPreferences", "User Preferences")}
          description={t("settings.userPreferencesSub", "Customize your dashboard experience")}
        />
        <CardContent>
          <p>{t("settings.userPreferencesInfo", "User preference settings will be displayed here.")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title={t("settings.systemConfig", "System Configuration")}
          description={t("settings.systemConfigSub", "Hospital system configuration settings")}
        />
        <CardContent>
          <p>{t("settings.systemConfigInfo", "System configuration options will be displayed here.")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
