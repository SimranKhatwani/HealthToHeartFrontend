// useInitSocket.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "../../redux/slices/socketSlice";
import { useFetchLoggedInUserQuery } from "../../redux/slices/authSlice"
import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_SOCKET_API_URL;

export const socket = io(apiUrl, {
    withCredentials: true,
    autoConnect: false,
});

// console.log("socket", socket)
const useInitSocket = () => {
  const dispatch = useDispatch();
  const { data: loggedInUser } = useFetchLoggedInUserQuery();
  // console.log("loggedInUser", loggedInUser)

  useEffect(() => {
    if (loggedInUser?._id && !socket.connected) {
      socket.connect();
      socket.emit("add-user", loggedInUser._id);
  
      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
    }
  
    return () => {
      socket.off("getOnlineUsers");
      socket.disconnect();
    };
  }, [loggedInUser?._id]);
};

export default useInitSocket;
