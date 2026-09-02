import React, { useState } from 'react';
import { useCreateMessageMutation } from "../../redux/slices/messageSlice";
import {socket} from "../../components/hooks/useInitSocket";
import { useCreateNotificationsMutation } from "../../redux/slices/notificationSlice";
import { useTranslation } from 'react-i18next';


const MessageBox = ({showMessageDialog, setShowMessageDialog, msg }) => {
  const { t } = useTranslation();

    const [createMessage]  = useCreateMessageMutation();
    const [createNotification] = useCreateNotificationsMutation();
    const [formData, setFormData] = useState({
        receiver: msg?.sender,
        subject: msg?.subject,
        message: "",
      })

    const handleChange = (e) => {
        setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };
      
    const handleSendMessage = async(e) => {
        e.preventDefault();
        // const formData = new FormData(e.target);
        const response = await createMessage(formData).unwrap()
        if(response.success === true){
      
            socket.emit("message-sent", {
                to: response.data.receiver,
                message: response.data.message,
                date: new Date(),
                status: response.data.status
                })
      
                await createNotification({
                sender:  msg?.receiver,
                receiver: msg?.sender,
                message: "New Message.",
                notDesc:  'You have recieved a new message'
                });
            }
            setFormData([])
            setShowMessageDialog(false)
        };
  return (
    <div>
        {showMessageDialog && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{t('translation:reply')}</h3>
            <form onSubmit={handleSendMessage}>
              <textarea
                name="message"
                placeholder={t('translation:message')}
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
                >{t('translation:cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded">{t('translation:send')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageBox