import { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { setMode, setColor } from '../redux/slices/themeSlice'; // Adjust path as needed
import ThemeMenu from './ThemeMenu';

const SettingsButton = () => {
  const [openMenu, setOpenMenu] = useState(false);
  // const dispatch = useDispatch();
  // const { mode, color } = useSelector((state) => state.theme);

  // Apply global theme changes
  // useEffect(() => {
  //   document.documentElement.classList.remove('light', 'dark');
  //   if (mode === 'system') {
  //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
  //   } else {
  //     document.documentElement.classList.add(mode);
  //   }

  //   // Optional: Apply custom color to root
  //   document.documentElement.style.setProperty('--theme-color', color);
  // }, [mode, color]);

  return (
    <>
      <div className="fixed right-2 top-1/3 transform -translate-y-1/2 z-50 cursor-pointer">
        <div
          className="bg-blue-500 dark:bg-darkSecondary p-3 rounded-full shadow-lg spin-slow hover:spin-fast transition"
          onClick={() => setOpenMenu(true)}
        >
          <FaCog size={20} className="text-white" />
        </div>
      </div>

      {openMenu && (
        <ThemeMenu
          setOpenMenu={setOpenMenu}
          // onSetMode={(mode) => dispatch(setMode(mode))}
          // onSetColor={(color) => dispatch(setColor(color))}
          // currentMode={mode}
          // currentColor={color}
        />
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spinSlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spinFast {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin-slow {
            animation: spinSlow 2s linear infinite;
          }
          .hover\\:spin-fast:hover {
            animation: spinFast 0.4s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default SettingsButton;
