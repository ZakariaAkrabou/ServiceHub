import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";


import { initSocket } from "./config/socket.js";
import { chatSocket } from "./socket/chatSocket.js";
import { startCronJobs } from "./utils/corn.js";

import authRoutes from "./routes/auth.route.js";
import serviceRoutes from "./routes/service.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import reviewRoutes from "./routes/review.route.js";
import contactRoutes from "./routes/contact.route.js";
import customerRoutes from "./routes/customer.route.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet())

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = initSocket(server);
chatSocket(io);

app.set("io", io);
startCronJobs();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
