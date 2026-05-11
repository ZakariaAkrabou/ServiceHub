import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

   
    socket.on("join", (userId, role) => {
      socket.join(userId);
      if (role === "admin") {
        socket.join("admin");
        console.log(`Admin ${userId} joined admin room`);
      }
      console.log(`User ${userId} joined their room: ${userId}`);
    });
 
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};