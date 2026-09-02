import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./UI/Avatar";
import { X, Pencil, LogOut } from "lucide-react";
import { socket } from "../components/hooks/useInitSocket";
import axios from "axios"; // If you want to send updates to backend
import { useUpdateDoctorMutation } from "../redux/slices/doctorSlice";
import { useSelector } from "react-redux"
import { translateValue } from '../utilis/translate';
import { useTranslation } from 'react-i18next';

const UserProfile = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const { role } = useSelector((state) => state.role);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    prefix: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    status: "",
    specialization: "",
    department: "",
    experienceYears: "",
    availability: false,
    description: "",
    education: [],
    experience: [],
    avatar: null,
  });
  const [adminFormdata, setAdminFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    avatar: null,
  })

  const [initialData, setInitialData] = useState(formData);
  const [preview, setPreview] = useState(null);
  const [updateDoctor] = useUpdateDoctorMutation();
  const isAdmin = role === "admin";
  const isDoctor = role === "Doctor";
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user
      }));
      setInitialData(user);
    }
  }, [user]);
   // Handle field changes
   const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    if (type === "file") {
      if (files.length > 0) {
        setSelectedFile(files[0]);
        setFormData(prev => ({ ...prev, avatar: files[0] }));
        setPreview(URL.createObjectURL(files[0]));
      }
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: Boolean(checked) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = new FormData();
  
    // Append formData fields carefully
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (key === "avatar" && value instanceof File) {
          updatedFormData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item) => updatedFormData.append(`${key}[]`, item));
        } else {
          updatedFormData.append(key, value);
        }
      }
    });
  
    try {
      if (isAdmin) {
        const response = await axios.put(
          `${apiUrl}/MospiltalAdmin/${user._id}`,
          updatedFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // VERY important for cookies
          }
        );        
      } else {
        const response = await updateDoctor(updatedFormData).unwrap();
      }
  
      setShowEditForm(false);
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("light");
    socket.disconnect();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Avatar Trigger */}
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        <Avatar className="h-10 w-10 border border-teal-500 shadow-sm">
        {user?.avatar ? (
          <AvatarImage
            src={`${apiUrl}/${isAdmin ? "MospiltalAdmin" : "medicalstaff"}/avatar/${user._id}`}
            alt={user.name}
          />
        ) : (
          <AvatarFallback className="bg-teal-500 text-white font-bold uppercase">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        )}
        </Avatar>
      </div>

      {/* Right Slide-In Modal */}
      {/* Right Slide-In Modal */}
{open && (
  <div className="fixed inset-0 z-[1000] flex justify-end">
    {/* Backdrop for sidebar */}
    <div
      className="fixed inset-0 bg-black/20"
      onClick={() => {
        setOpen(false);
        setShowEditForm(false);
      }}
    />

    {/* Sidebar Panel */}
    <div className="relative w-full sm:w-[350px] h-1/2 bg-white p-2 shadow-2xl transition-all duration-300 ease-in-out rounded-l-2xl overflow-y-auto">
      <div className="flex flex-col space-y-4 mt-5">
        {/* Avatar + Name */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-teal-500 shadow">
            {user?.avatar ? (
              <AvatarImage src={`${apiUrl}/${isAdmin ? "MospiltalAdmin" : "medicalstaff"}/avatar/${user._id}`} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-teal-500 text-white font-bold uppercase">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold text-teal-700">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <hr />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-12">
          <button
            className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            onClick={() => setShowEditForm(true)}
          >
            <Pencil className="mr-2 w-4 h-4" />{t('translation:editProfile')}</button>

          <button
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={logout}
          >
            <LogOut className="mr-2 w-4 h-4" />{t('translation:logout')}</button>
        </div>
      </div>
    </div>

    {/* Center Modal for Edit Form */}
    {showEditForm && (
      <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/30">
        <div className="bg-white w-[90%] sm:w-[600px] rounded-xl shadow-xl p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={() => setShowEditForm(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-teal-700 mb-4">{t('translation:editProfile')}</h2>
          <form onSubmit={handleSubmit} className="p-4 space-y-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
        {isDoctor &&  <input type="text" name="prefix" placeholder={t('translation:prefix')} value={formData.prefix} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />}
        <input type="text" name="first_name" placeholder={t('translation:firstName')} value={formData.first_name} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="text" name="last_name" placeholder={t('translation:lastName')} value={formData.last_name} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="email" name="email" placeholder={t('translation:email')} value={formData.email} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="tel" name="phone" placeholder={t('translation:phone')} value={formData.phone} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="password" name="password" placeholder={t('translation:newPassword')} value={formData.password} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
        {isDoctor && <select name="status" value={translateValue('status', formData.status, t)} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="">{t('translation:selectStatus')}</option>
          <option value="active">{t('translation:active')}</option>
          <option value="on-leave">{t('translation:onLeave')}</option>
          <option value="resigned">{t('translation:resigned')}</option>
        </select>}
        { isDoctor && <input type="text" name="specialization" placeholder={t('translation:specialization')} value={formData.specialization} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />}
        { isDoctor && <input type="text" name="department" placeholder={t('translation:department')} value={formData.department} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />}
        { isDoctor && <input type="number" name="experienceYears" placeholder={t('translation:yearsOfExperience')} value={formData.experienceYears} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />}
        { isDoctor && <input type="text" name="description" placeholder={t('translation:description')} value={formData.description} onChange={handleChange}  className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />}  
      </div>
      {isDoctor && <div className="flex items-center space-x-2">
        <label className="font-semibold">{t('translation:available')}</label>
        <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
      </div>}
      <div>
        <label className="block font-semibold mb-1">{t('translation:avatar')}</label>
        <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        {preview && <img src={preview} alt={t('translation:preview')} className="h-20 mt-2 rounded" />}
      </div>

      <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">{t('translation:updateDetails')}</button>
    </form>
        </div>
      </div>
    )}
  </div>
)}
    </>
  );
};

export default UserProfile;
