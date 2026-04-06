import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

import authRoutes from "./routes/auth.route.js";
import serviceRoutes from "./routes/service.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import reviewRoutes from "./routes/review.route.js";
import contactRoutes from "./routes/contact.route.js";
import customerRoutes from "./routes/customer.route.js";

import cors from "cors";
import { initSocket } from "./config/socket.js";
import http from "http";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/reviews", reviewRoutes);



const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initSocket(server);

app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
