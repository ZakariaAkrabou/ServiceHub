import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProviderStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const provider = await User.findById(userId);
    if (!provider || provider.role !== "service_provider") {
      return res.status(404).json({ message: "Provider not found" });
    }
    provider.status = status;
    await provider.save();
    res.status(200).json({ message: `Provider status updated to ${status}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer_id", "firstName lastName email")
      .populate({
        path: "service_id",
        populate: {
          path: "provider_id",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ result: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("customer_id", "firstName lastName email")
      .populate({
        path: "service_id",
        populate: {
          path: "provider_id",
          select: "firstName lastName email",
        },
      });

    // ✅ BUG 5 CORRIGÉ : était "if (booking)" — retournait 404 quand le booking existait !
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({ message: "Booking retrieved successfully", data: booking });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const filtreBookings = async (req, res) => {
  try {
    const { status, customerId, providerId } = req.query;

    let filter = {};

    // ✅ BUG 2 CORRIGÉ : le champ dans booking.model.js s'appelle "status", pas "booking_status"
    if (status) filter.status = status;
    if (customerId) filter.customer_id = customerId;
    if (providerId) {
      const services = await Service.find({ provider_id: providerId });
      const serviceIds = services.map((service) => service._id);
      filter.service_id = { $in: serviceIds };
    }

    const bookings = await Booking.find(filter)
      .populate("customer_id", "firstName lastName email")
      // ✅ BUG 3 CORRIGÉ : nested populate pour avoir provider_id dans service_id
      .populate({
        path: "service_id",
        populate: {
          path: "provider_id",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ result: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};