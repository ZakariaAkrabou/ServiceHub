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
            console.log("Received sendMessage event:", data);
            const { bookingId, senderId, message } = data;

            try {
                const booking = await Booking.findById(bookingId).populate({
                    path: "service_id",
                    populate: { path: "provider_id" },
                });

                if (!booking) {
                    console.log("Booking not found");
                    return;
                }
                const providerId = booking.service_id.provider_id._id.toString();
                const customerId = booking.customer_id.toString();
                
                console.log("Provider:", providerId, "Customer:", customerId, "Sender:", senderId);
                
                if (senderId !== providerId && senderId !== customerId) {
                    console.log("Sender unauthorized");
                    return;
                }
                if(booking.status !== "confirmed" || booking.chosenContactMethod !== "chat"){
                    console.log("Booking not confirmed or chat method not chosen");
                    return;
                }

                const receiverId = senderId === customerId ? providerId : customerId;
                const newMessage = new Chat({
                    booking_id: bookingId,
                    sender_id: senderId,
                    receiver_id: receiverId,
                    message,
                });
                await newMessage.save();
                console.log("Message saved:", newMessage);
                
                const room = `booking_${bookingId}`;
                io.to(room).to(providerId).to(customerId).emit("receive_message", { success: true, message: newMessage });
                console.log("Message emitted to booking and user rooms:", room, providerId, customerId);
            } catch (error) {
                console.error("Error in sendMessage:", error);
            }
        });
        socket.on("mark_read", async ({ bookingId, userId }) => {
            try {
                await Chat.updateMany(
                    { booking_id: bookingId, receiver_id: userId, isRead: false },
                    { $set: { isRead: true } }
                );
                const room = `booking_${bookingId}`;
                io.to(room).emit("messages_read", { bookingId, userId });
            } catch (error) {
                console.error("Error marking messages read:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        })
    });
};