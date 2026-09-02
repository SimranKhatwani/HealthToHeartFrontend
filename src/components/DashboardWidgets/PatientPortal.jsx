import React, { useState, useMemo } from "react";
import { Calendar, Clock, FileText, MessageSquare, Send, User, Users, ArrowUpRight } from "lucide-react";
import { useGetAppointmentsQuery } from "../../redux/slices/appointmentsSlice";
import { useSelector } from "react-redux";
import { useCreateMessageMutation } from "../../redux/slices/messageSlice" 
import { useGetPatientsQuery } from "../../redux/slices/patientSlice" 
import { useCreateNotificationsMutation } from "../../redux/slices/notificationSlice";
import { useFetchLoggedInUserQuery } from "../../redux/slices/authSlice";
import {socket} from "../../components/hooks/useInitSocket";
import { useGetMessagesQuery } from "../../redux/slices/messageSlice"
import ChatCard from "./ChatCard";
import { useTranslation } from "react-i18next";
import { translateValue } from '../../utilis/translate';

const PatientPortal = () => {
  const { t, i18n } = useTranslation();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const { data : appointmentData} = useGetAppointmentsQuery();
  const { data : patients} = useGetPatientsQuery();
  const [createMessage]  = useCreateMessageMutation();
  const [createNotification] = useCreateNotificationsMutation();
  const { data: logInUser } = useFetchLoggedInUserQuery();
  const { mode } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState({
    receiver: "",
    subject: "",
    message: "",
  });
  const {data: messages} = useGetMessagesQuery()
  const [openChatBox, setOpenChatBox] = useState(false)

  const groupedMessages = useMemo(() => {
    const groups = {};

    messages?.messages?.forEach((msg) => {
      const receiver = msg.receiver || msg.sender;

      if (!groups[receiver]) {
        groups[receiver] = [];
      }

      groups[receiver].push(msg);
    });

    return groups;
  }, [messages]);

  // Format date
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleString(i18n.language === "fr" ? "fr-FR" : "en-US", options);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    const response = await createMessage(formData).unwrap()
    if(response.success === true){

          socket.emit("message-sent", {
              to: response.data.receiver,
              message: response.data.message,
              date: new Date(),
              status: response.data.status
            })

            await createNotification({
              sender: logInUser._id,
              receiver: response.data.receiver,
              message: "New Message.",
              notDesc: new Date()
            });
          }
    setFormData([])
    setShowMessageDialog(false)
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200"
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.patientPortal", "Patient Portal")}</h2>
          <p className="text-gray-500">{t("dashboard.patientPortalSub", "Patient communications and appointments")}</p>
        </div>
        <button
          className="bg-teal-500 text-white px-1 md:px-4 py-0.5 md:py-2 rounded-md hover:bg-teal-600 flex items-center"
          onClick={() => setShowMessageDialog(true)}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          {t("dashboard.newMessage", "New Message")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
  <button
    className={`p-3 ${
      activeTab === "messages"
        ? "text-teal-600 border-b-2 border-teal-600"
        : "text-gray-500 hover:text-teal-600"
    }`}
    onClick={() => setActiveTab("messages")}
  >
    {t("dashboard.messages", "Messages")}
  </button>
  <button
    className={`p-3 ${
      activeTab === "appointments"
        ? "text-teal-600 border-b-2 border-teal-600"
        : "text-gray-500 hover:text-teal-600"
    }`}
    onClick={() => setActiveTab("appointments")}
  >
    {t("dashboard.appointments", "Appointments")}
  </button>
</div>


      {/* Messages */}
      {activeTab === "messages" &&  (
        <div className="space-y-4"  >
        {Object.entries(groupedMessages).length > 0 ? (
            Object.entries(groupedMessages).map(([receiver, msgs]) => (
          <div key={receiver} 
          className="mb-6">
          <h3 className="font-bold text-lg mb-3">
            To: {msgs[0]?.receiver?.name || receiver}
          </h3>

      {msgs.slice(0, 1).map((message) => (
        <div
          key={message.id}
          onClick={() =>
            setOpenChatBox((prev) =>
              prev === message?.receiver?._id ? null : message?.receiver?._id
            )
          }
          className={`${
            mode === "dark" ? "bg-gray-800" : "bg-gray-50"
          } p-4 rounded-lg shadow-md border-l-4 mb-4`}
          style={{
            borderColor:
              message.priority === "high" ? "#f87171" : "#fb923c",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              <span className="font-medium">{message?.receiver?.name}</span>
            </div>
            <span className="text-sm text-gray-400">
              {formatDate(message?.timestamp)}
            </span>
          </div>
          <h4 className="font-medium">{message.subject}</h4>
          <p className="text-gray-600 mt-2">{message.message}</p>

          {openChatBox === message?.receiver?._id && (
            <div onClick={(e) => e.stopPropagation()}>
              <ChatCard
                messages={msgs}
                onSend={handleSendMessage}
                openChatBox={true}
                setOpenChatBox={() => setOpenChatBox(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">{t("dashboard.noMessagesYet", "No messages yet")}</p>
            </div>
          )}
      </div>
      )}
      

      {/* Appointments */}
      {activeTab === "appointments" && (
        <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">{t("dashboard.upcomingAppointments", "Upcoming Appointments")}</h3>
        <div className="space-y-4">
          {appointmentData?.data?.slice(0, 3).map((appointment) => (
            <div key={appointment._id} className={`${ mode === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg shadow-md`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{formatDate(appointment.slotTime)}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === "confirmed" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {t(`status.${translateValue('status', appointment.status, t)}`, appointment.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{appointment?.patientId?.name}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{appointment?.doctorId?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* New Message Dialog */}
      {showMessageDialog && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{t("dashboard.newMessage", "New Message")}</h3>
            <form onSubmit={handleSendMessage}>
            <select
                name="receiver"
                value={formData.receiver}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="">{t("dashboard.selectPatient", "Select Patient")}</option>
                {patients?.data?.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="subject"
                placeholder={t("dashboard.subject", "Subject")}
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <textarea
                name="message"
                placeholder={t("dashboard.message", "Message")}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                rows="4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowMessageDialog(false)}
                >
                  {t("common.cancel", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded">
                  {t("common.send", "Send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
