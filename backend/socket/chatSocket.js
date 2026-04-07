import Booking from "../models/booking.model.js";
import Chat from "../models/chat.model.js";

export const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);

        socket.on("joinRoom", async (bookingId, userId) => {
            const booking = await Booking.findById(bookingId).populate({
                path: "service_id",
                populate: { path: "provider_id" },
            });
            if (!booking) return;
            const providerId = booking.service_id.provider_id._id.toString();
            const customerId = booking.customer_id.toString();
            if (userId !== providerId && userId !== customerId) return;

            if(booking.status !== "confirmed" || booking.chosenContactMethod !== "chat"){ return; }
            const room = `booking_${bookingId}`;
            socket.join(room);
            console.log(`User ${userId} joined room ${room}`);
        });
        socket.on("sendMessage", async ({ data }) => {
            const { bookingId, senderId, message } = data;

            const booking = await Booking.findById(bookingId).populate({
                path: "service_id",
                populate: { path: "provider_id" },
            });

            if (!booking) return;
            const providerId = booking.service_id.provider_id._id.toString();
            const customerId = booking.customer_id.toString();
            if (senderId !== providerId && senderId !== customerId) return;
            if(booking.status !== "confirmed" || booking.chosenContactMethod !== "chat"){ return; }

            const receiverId = senderId === customerId ? providerId : customerId;
            const newMessage = new Chat({
                booking_id: bookingId,
                sender_id: senderId,
                receiver_id: receiverId,
                message,
            });
            const room = `booking_${bookingId}`;
            io.to(room).emit("receive_message", {success: true, message: newMessage});
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        })
    });
};