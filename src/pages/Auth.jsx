import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import MaleDoc from "../utilis/MaleDoc.png";
import { setRole } from "../redux/slices/rolesSlices";
import { useTranslation } from "react-i18next";


const Auth = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.role);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onlineUsers = useSelector((state) => state.socket.onlineUsers);

  const apiUrl = import.meta.env.VITE_API_URL;

  const currentLanguage = i18n.language || "en";

  const toggleLanguage = () => {
    const nextLang = currentLanguage.startsWith("en") ? "fr" : "en";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("i18nextLng", nextLang);
  };


  // console.log("onlineUsers", onlineUsers)
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      try {
        const decodedToken = jwtDecode(token);
        navigate(`/${decodedToken.role}/dashboard`);
      } catch (error) {
        // console.error("Invalid token:", error);
      }
    } else {
      navigate(`/login`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.warn(t('translation:pleaseFillInAllFields'));
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/auth/staff-login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(t('translation:loginSuccessful'));

        const { token } = response.data;
        const decodedToken = jwtDecode(token);

        localStorage.setItem("token", token);

        dispatch(setRole(decodedToken.role));

        setTimeout(() => {
          navigate(`/${decodedToken.role}/dashboard`);
        }, 0);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      // console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center shadow-xl rounded-lg overflow-hidden bg-white">
        
        {/* Sidebar Image */}
        <div className="hidden md:flex items-center justify-center bg-[#34b1af]">
          <img src={MaleDoc} alt={t('translation:doctor')} className="w-80 h-auto" />
        </div>

        {/* Login Form */}
        <div className="w-full p-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-gray-800">{t("auth.login", "Login")}</h2>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
              aria-label="Switch Language"
            >
              <span className={currentLanguage.startsWith("en") ? "text-teal-500 font-bold" : "text-gray-400"}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={currentLanguage.startsWith("fr") ? "text-teal-500 font-bold" : "text-gray-400"}>FR</span>
            </button>
          </div>
          <p className="text-gray-500 mb-6">
            {t("auth.enterCredentials", "Enter your credentials to access the dashboard")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-gray-700">{t("auth.email", "Email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('translation:userexamplecom')}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700">{t("auth.password", "Password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "opacity-50 cursor-not-allowed" : ""} bg-[#00a19d] text-white py-3 rounded-md hover:bg-[#0fb3af] transition`}
            >
              {t("auth.login", "Login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
