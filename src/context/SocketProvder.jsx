import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// for SocketContext we just want useSocket to use socket as a context
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("https://peer-connector-backend.onrender.com"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};