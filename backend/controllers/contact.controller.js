import Booking from "../models/booking.model.js";


export const getContactMethods = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findById(bookingId).populate({
      path: "service_id",
      populate: { path: "provider_id" },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

   
    if (String(booking.customer_id) !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

  
    if (booking.status !== "confirmed") {
      return res.status(403).json({
        message: "Booking must be confirmed first",
      });
    }

    const provider = booking.service_id.provider_id;

    let methods = ["chat"];

    if (provider.email) methods.push("email");
    if (provider.phone) methods.push("phone");

    res.status(200).json({
      success: true,
      availableMethods: methods,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const selectContactMethod = async (req, res) => {
  try {
    const { booking_id, method } = req.body;
    const userId = req.user.userId;

    const booking = await Booking.findById(booking_id).populate({
      path: "service_id",
      populate: { path: "provider_id" },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.customer_id) !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (booking.status !== "confirmed") {
      return res.status(403).json({
        message: "Booking must be confirmed first",
      });
    }

    const provider = booking.service_id.provider_id;

    if (method === "email") {
      return res.status(200).json({
        method: "email",
        value: provider.email,
      });
    }

    if (method === "phone") {
      return res.status(200).json({
        method: "phone",
        value: provider.phone,
      });
    }

    if (method === "chat") {
      return res.status(200).json({
        method: "chat",
        roomId: `booking_${booking._id}`,
      });
    }

    return res.status(400).json({
      message: "Invalid contact method",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};