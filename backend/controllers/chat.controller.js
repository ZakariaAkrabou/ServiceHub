import Booking from "../models/booking.model.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const getChatMessages = async (req, res) => {
    try{
        const { bookingId } = req.params;
        const userId = req.user.userId;

        const booking = await Booking.findById(bookingId).populate({
            path:"service_id",
            populate: {path :"provider_id"}
        });

        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }
        const providerId = booking.service_id.provider_id._id.toString();
        const cutomerId = booking.customer_id.toString();

        if(userId !== providerId && userId !== cutomerId){
            return res.status(403).json({ message: "Unauthorized" });
        }
        if(booking.status !== "confirmed" || booking.chosenContactMethod !== "chat"){
            return res.status(400).json({ message: "Chat not available for this booking" });
        }
        const chat = await Chat.find({ booking_id: bookingId }).sort({ createdAt: 1 });
        
        res.status(200).json({success: true, chat  });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUnreadChatCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const count = await Chat.countDocuments({ receiver_id: userId, isRead: false });
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.userId;

        await Chat.updateMany(
            { booking_id: bookingId, receiver_id: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};