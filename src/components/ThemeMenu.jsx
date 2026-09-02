import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { IoMdColorPalette } from "react-icons/io";
import clsx from "clsx";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMode,
  setHeaderColor,
  // setHeaderGradient,
  setSidebarColor,
  // setSidebarGradient,
} from '../redux/slices/themeSlice';

const colors = [
  "#ffffff", 
  "#e4e4e7", 
  "#4b5563", 
  "#10b981", 
  "#3b82f6", 
  "#9333ea", 
  "#000000", 
  "bg-gradient-to-br from-slate-800 to-slate-600",
  "bg-gradient-to-br from-blue-500 to-blue-300",
  "bg-gradient-to-br from-purple-500 to-purple-300",
  "bg-gradient-to-br from-teal-500 to-teal-300",
  "bg-gradient-to-br from-pink-500 to-orange-300",
  "bg-gradient-to-br from-purple-700 to-orange-400"];

  const headerColors = [
    "#ffffff", 
    "#fbfbfb", 
    "#efeaed", 
    "#d3d5d7", 
    "#ffeee9",  
    "bg-gradient-to-br from-slate-800 to-slate-600",
    "bg-gradient-to-br from-blue-500 to-blue-300",
    "bg-gradient-to-br from-purple-500 to-purple-300",
    "bg-gradient-to-br from-teal-500 to-teal-300",
    "bg-gradient-to-br from-pink-500 to-orange-300",
    "bg-gradient-to-br from-purple-700 to-orange-400"];
// const gradientColors = [
//   "bg-gradient-to-br from-slate-800 to-slate-600",
//   "bg-gradient-to-br from-blue-500 to-blue-300",
//   "bg-gradient-to-br from-purple-500 to-purple-300",
//   "bg-gradient-to-br from-teal-500 to-teal-300",
//   "bg-gradient-to-br from-pink-500 to-orange-300",
//   "bg-gradient-to-br from-purple-700 to-orange-400"
// ];

const ThemeMenu = ({ setOpenMenu }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mode, header, sidebar } = useSelector((state) => state.theme);
  const [selectedColor, setSelectedColor] = useState(sidebar.color || "#4b5563");
  const [selectedHeaderColor, setSelectedHeaderColor] = useState(header.color || "#4b5563");
  const [themeMode, setThemeMode] = useState(mode || "light");

  const ref = useOutsideClick(() => {
    setOpenMenu(false);
  });

  // Update the document root class for dark/light mode
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(mode);
    }

    document.documentElement.style.setProperty('--theme-color', sidebar.color || "#4b5563");
    document.documentElement.style.setProperty('--theme-color', header.color || "#4b5563");
  }, [mode, sidebar.color, header.color]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    dispatch(setSidebarColor(color));
  };

  const handleHeaderColorChange = (color) => {
    setSelectedHeaderColor(color);
    dispatch(setHeaderColor(color));
  };

  const handleModeChange = (newMode) => {
    setThemeMode(newMode);
    dispatch(setMode(newMode));
  };

  return (
    <div ref={ref} className={`fixed top-0 right-0 h-full w-96 ${mode === "dark" ? "bg-black" : "bg-white" } shadow-xl z-50 overflow-y-auto rounded-l-xl`}>
      {/* Header */}
      <div className="flex flex-col justify-between items-start mb-4 bg-teal-600 p-4">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold text-white">{t('translation:themeCustomizer')}</h2>
          <X className="cursor-pointer text-white bg-gray-600 hover:bg-red-500 rounded-full p-0.5" onClick={() => setOpenMenu(false)} />
        </div>
        <p className="text-sm text-gray-300 mt-2">{t('translation:chooseYourThemesLayoutsEtc')}</p>
      </div>

      <div className="p-6">

        {/* Header Color Picker */}
        <div className="border-2 border-gray-200 p-3 rounded-lg">
          <h3 className={`text-left py-2 font-semibold ${mode === "dark" ? "text-white" : "text-black" } border-b border-gray-300`}>{t('translation:headerColor')}</h3>
          <div className="space-y-4 mt-3">
            <p className="text-sm text-gray-500">{t('translation:solidColors')}</p>
            <div className="flex flex-wrap gap-2">
              {headerColors.slice(0,4).map((color) => (
                <div
                  key={color}
                  className={clsx("w-8 h-8 rounded-full border-2 cursor-pointer", {
                    "border-blue-500": selectedHeaderColor === color
                  })}
                  style={{ backgroundColor: color }}
                  onClick={() => handleHeaderColorChange(color)}
                />
              ))}
              {/* Custom color picker */}
              <label className="relative w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden">
                <input
                  type="color"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleHeaderColorChange(e.target.value)}
                />
                <div className="w-full h-full" style={{ backgroundColor: selectedHeaderColor }} />
                <IoMdColorPalette className="absolute inset-0 m-auto text-white text-[16px] pointer-events-none" />
              </label>
            </div>

            <p className="text-sm text-gray-500 mt-4">{t('translation:gradientColors')}</p>
            <div className="flex flex-wrap gap-2">
              {headerColors.slice(5, 11).map((gradient, i) => (
                <div
                  key={i}
                  className={clsx("w-8 h-8 rounded-full cursor-pointer border-2", gradient, {
                    "border-blue-500": selectedHeaderColor === gradient
                  })}
                  onClick={() => handleHeaderColorChange(gradient)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Color Picker */}
        <div className="border-2 border-gray-200 p-3 rounded-lg mt-6">
          <h3 className={`text-left py-2 font-semibold ${mode === "dark" ? "text-white" : "text-black" } border-b border-gray-300`}>{t('translation:sidebarColor')}</h3>
          <div className="space-y-4 mt-3">
            <p className="text-sm text-gray-500">{t('translation:solidColors')}</p>
            <div className="flex flex-wrap gap-2">
              {colors.slice(0,6).map((color) => (
                <div
                  key={color}
                  className={clsx("w-8 h-8 rounded-full border-2 cursor-pointer", {
                    "border-blue-500": selectedColor === color
                  })}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
              {/* Custom color picker */}
              <label className="relative w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden">
                <input
                  type="color"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                <div className="w-full h-full" style={{ backgroundColor: selectedColor }} />
                <IoMdColorPalette className="absolute inset-0 m-auto text-white text-[16px] pointer-events-none" />
              </label>
            </div>

            <p className="text-sm text-gray-500 mt-4">{t('translation:gradientColors')}</p>
            <div className="flex flex-wrap gap-2">
              {colors.slice(7, 12).map((gradient, i) => (
                <div
                  key={i}
                  className={clsx("w-8 h-8 rounded-full cursor-pointer border-2", gradient, {
                    "border-blue-500": selectedColor === gradient
                  })}
                  onClick={() => handleColorChange(gradient)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Theme Mode */}
        <div className="mt-6 border-2 border-gray-200 p-3 rounded-lg">
          <h3 className="text-left py-2 font-semibold text-black border-b border-gray-300">{t('translation:themeMode')}</h3>
          <div className="flex gap-3 mt-3">
            {["light", "dark"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={clsx("px-4 py-2 border rounded text-sm capitalize flex items-center gap-2", {
                  "bg-blue-500 text-white border-blue-500": themeMode === mode,
                  "border-gray-300 text-gray-600": themeMode !== mode
                })}
              >
                {mode === "light" && <IoSunny className="text-lg" />}
                {mode === "dark" && <IoMoon className="text-lg" />}
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeMenu;
