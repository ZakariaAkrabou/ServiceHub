import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io("http://localhost:5000", {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socketInstance;
};

export const useSocket = (userId: string | undefined, role: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userId, role);

    return () => {
      // Do not disconnect on unmount — keep single persistent connection
    };
  }, [userId, role]);

  return socketRef;
};
