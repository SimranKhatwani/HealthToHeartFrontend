  import { useState, useRef, useEffect } from "react";
  import {
    Bell,
    X,
    CheckCheck,
    AlertCircle,
    Calendar,
    FileText,
    Pill,
    Activity,
  } from "lucide-react";
  import { useDeleteAllNotificationsMutation, useDeleteNotificationsMutation, useGetAllNotificationsQuery } from "../redux/slices/notificationSlice";
  import useFormattedDate from "../components/hooks/useFormattedDate";
  import {socket} from "../components/hooks/useInitSocket";
  import { useOutsideClick } from "./hooks/useOutsideClick";
  import { useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { useLocation } from "react-router-dom";
  import { useGetNotificationsByEmailQuery } from "../redux/slices/notificationSlice";
import { useTranslation } from 'react-i18next';

  const NotificationCenter = () => {
  const { t } = useTranslation();
    const { state } = useLocation();
    const email = state?.userDetails?.email;
    // console.log("email", email)
    const { data: notifications = [], isLoading} = useGetAllNotificationsQuery();
    const { data: patientNotification = [], error, refetch } = useGetNotificationsByEmailQuery(email, {
      skip: !email, // This tells RTK Query to skip fetching if email is undefined
    });
    // console.log("patientNotification", patientNotification)
    // const [ deleteNotifications ] = useDeleteNotificationsMutation();
    const [ deleteAllNotifications ] = useDeleteAllNotificationsMutation();
    const formatDate = useFormattedDate() 
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false); // Modal visibility

    const [localNotifications, setLocalNotifications] = useState([]);
    const { role } = useSelector((state) => state.role);
    
      // Listen for Real-Time Notifications
      useEffect(() => {
        if (socket) {
          socket.on('notification-received', (data) => {
            // console.log("data", data)
            setLocalNotifications((prev) => {
              const exists = prev.some((notif) => notif._id === data._id);
              if (!exists) {
                return [
                  {
                    _id: data._id || crypto.randomUUID(),
                    message: data.message,
                    notDesc: data.notDesc,
                    sender: data.sender,
                    timestamp: data.timestamp ?? new Date().toISOString(),
                  },
                  ...prev,
                ];
              }
              return prev;
            });
          });
      
          // Cleanup on unmount
          return () => {
            socket.off('notification-received');
          };
        }
      }, [socket]);

    // Sync local state when new notifications are fetched
    useEffect(() => {
      if (notifications?.data?.length > 0) {
        setLocalNotifications(notifications?.data);
      }
    }, [notifications, socket]);

    useEffect(() => {
      if(patientNotification?.data?.length > 0){
        setLocalNotifications(patientNotification?.data);
      }
    }, [socket, patientNotification]);

    const unreadCount = localNotifications.filter((n) => !n.read).length;

    const toggleModal = () => setIsOpen((prev) => !prev);

    const ref = useOutsideClick(() => {
      setIsOpen(false);
      })


    return (
      <div className="relative" ref={ref}>
        {/* Bell Icon */}
        <button onClick={toggleModal} className="relative p-2 rounded-full hover:bg-gray-200">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Modal */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border-2 border-teal-400 z-50">
            <div className="flex justify-between items-center p-4 border-b border-teal-400">
              <h3 className="text-lg font-semibold">{t('translation:notifications')}</h3>
              <button
                className="text-sm text-blue-500 hover:underline flex items-center"
                onClick={async () => {
                  try {
                    await deleteAllNotifications().unwrap();
                    setLocalNotifications([]);
                  } catch (err) {
                    console.error("Error clearing notifications:", err);
                  }
                }}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4 mr-1" />{t('translation:markAllAsRead')}</button>
            </div>

            <div className="max-h-72 overflow-y-auto">
    {isLoading ? (
      <div className="p-4 text-center text-sm text-gray-500">{t('translation:loading')}</div>
    ) : localNotifications.length > 0 ? (
      localNotifications.map((notification) => {
        const lowerCaseMessage = `${notification.message} ${notification.notDesc}`.toLowerCase()

        const handleNotificationClick = () => {
          if (lowerCaseMessage.includes("operation")) {
            navigate(`/${role.toLowerCase()}/operations`)
          }
          if (lowerCaseMessage.includes("appointment")) {
            navigate(`/${role.toLowerCase()}/appointments`)
          }
          // You can add other route checks here if needed
        }

        return (
          <div
            key={notification._id}
            className={`flex items-start gap-4 p-4 hover:bg-gray-100 ${
              !notification.read ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex-1 cursor-pointer" onClick={handleNotificationClick}>
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{notification.message}</h4>
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotifications(notification._id).unwrap()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button> */}
              </div>
              { !email && <p className="text-sm text-gray-600">{formatDate(notification.notDesc)}</p>}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        )
      })
    ) : (
      <div className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h4 className="text-lg font-semibold">{t('translation:noNotifications')}</h4>
        <p className="text-sm text-gray-500">{t('translation:youreAllCaughtUp')}</p>
      </div>
    )}
  </div>

            {/* <div className="p-4 border-t">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              oonClick={async () => {
                try {
                  await deleteAllNotifications().unwrap();
                  setLocalNotifications([]);
                } catch (err) {
                  console.error("Error clearing notifications:", err);
                }
              }}>
                View all notifications
              </button>
            </div> */}
          </div>
        )}
      </div>
    );
  };

  export default NotificationCenter;
