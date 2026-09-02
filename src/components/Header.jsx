import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./UI/Avatar";
import { format } from "date-fns";
import { useFetchLoggedInUserQuery } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import NotificationCenter from "../components/NotificationCenter";
import clsx from "clsx";
import UserProfile from "./UserProfile";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const today = format(new Date(), "d MMM yyyy, EEEE");
  const { data } = useFetchLoggedInUserQuery();
  const { mode, header } = useSelector((state) => state.theme);
  const [greeting, setGreeting] = useState("");
  const [prefix, setPrefix] = useState("");
  const { role } = useSelector((state) => state.role);

  const currentLanguage = i18n.language || "en";

  const toggleLanguage = () => {
    const nextLang = currentLanguage.startsWith("en") ? "fr" : "en";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("i18nextLng", nextLang);
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greet = "";

    if (currentHour < 12) {
      greet = t("dashboard.goodMorning", "Good Morning");
    } else if (currentHour < 18) {
      greet = t("dashboard.goodAfternoon", "Good Afternoon");
    } else {
      greet = t("dashboard.goodEvening", "Good Evening");
    }

    setGreeting(greet);
  }, [t, i18n.language]);

  useEffect(() => {
    let prefix = "";
    if (role === "Doctor") {
      prefix = "Dr";
    }
    setPrefix(prefix);
  }, [role]);

  return (
    <header
      className={clsx(
        "w-full h-16 px-4 flex items-center justify-between",
        header.color?.includes("gradient") && header.color
      )}
      style={{
        background: !header.color?.includes("gradient")
          ? header.color || (mode === "dark" ? "#020817" : "#ffffff")
          : undefined,
        color: mode === "dark" ? "white" : "black",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="hidden lg:flex items-center gap-2 bg-teal-500 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-white" />
        </div>

        <div className="truncate">
          <h1
            className={clsx(
              "text-lg lg:text-xl font-bold truncate",
              ["#ffffff", "#fbfbfb", "#efeaed", "#d3d5d7"].includes(header.color)
                ? "text-black"
                : "text-white"
            )}
          >
            {t("dashboard.welcome", "Welcome back")}, {prefix} {data?.name} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{greeting}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          aria-label="Switch Language"
        >
          <span className={clsx(currentLanguage.startsWith("en") ? "text-teal-500 font-bold" : "text-gray-400")}>{t('translation:en')}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className={clsx(currentLanguage.startsWith("fr") ? "text-teal-500 font-bold" : "text-gray-400")}>{t('translation:fr')}</span>
        </button>

        <div className="hidden md:flex items-center border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm lg:text-md">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{today}</span>
        </div>

        {/* Notification Bell */}
        <NotificationCenter />

        {/* Avatar */}
        <div className="flex items-center justify-end">
          {data && <UserProfile user={data} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
