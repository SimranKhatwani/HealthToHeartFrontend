    import React, { useState, useEffect, useRef } from 'react';
    import { useFetchLoggedInUserQuery } from "../../redux/slices/authSlice";
    import { useCreateMessageMutation } from "../../redux/slices/messageSlice";
    import {socket} from "../../components/hooks/useInitSocket";
    import { useCreateNotificationsMutation } from "../../redux/slices/notificationSlice";
import { useTranslation } from 'react-i18next';



    const ChatCard = ({ messages = [], onSend, setOpenChatBox, openChatBox }) => {
  const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState('');
    const { data: user } = useFetchLoggedInUserQuery();
    const messagesEndRef = useRef(null);
    const [createMessage]  = useCreateMessageMutation();
    const [ createNotification ] = useCreateNotificationsMutation();

    useEffect(() => {
        if (messages.length > 0) {
          // Sort messages by timestamp to ensure chronological order
          const sortedMessages = [...messages].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
    
          // Get the last message
          const lastMessage = sortedMessages[sortedMessages.length - 1];
    
          // Check if the last message sender or receiver is not the current user
          const otherUser =
            lastMessage.sender !== user._id
              ? lastMessage.sender
              : lastMessage.receiver._id;
    
          // Set the receiver in formData
          setFormData((prevData) => ({
            ...prevData,
            receiver: otherUser,
          }));
    
          console.log("Last message's other user:", otherUser);
        }
      }, [messages, user]);
          
        const [formData, setFormData] = useState({
            receiver: "",
            subject: "",
            message: "",
        });
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
                    sender: user._id,
                    receiver: response.data.receiver,
                    message: "New Message.",
                    notDesc:  'You have recieved a new message'
                });
                }
                setFormData(prevState => ({
                    ...prevState,
                    message: "", // Reset the message field only
                  }));
        // setShowMessageDialog(false)
        };


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        openChatBox && (
        <div className="flex flex-col h-full rounded-lg shadow-md bg-white">
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length > 0 ? (
                [...messages]
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === user._id
                            ? 'ml-auto bg-blue-200 text-gray-800'
                            : 'mr-auto bg-gray-200 text-black'
                        }`}
                    >
            <p>{msg.message}</p>
            <span className="block text-xs mt-1 text-gray-400 text-right">
            {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
            </div>
            ))
            ) : (
            <p className="text-center text-gray-400">{t('translation:noMessagesYet')}</p>
            )}

            {/* <div ref={messagesEndRef} /> */}
            </div>

            {/* Input area */}
            <div className="p-3 flex items-center gap-2 bg-gray-300">
            <input
                type="text"
                name='message'
                value={formData.message}
                onChange={handleChange}
                // onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-300 focus:ring focus:ring-teal-400"
                placeholder={t('translation:typeAMessage')}
            />
            <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition"
            >{t('translation:send')}</button>
            </div>
        </div>
        )
    );
    };

    export default ChatCard;
