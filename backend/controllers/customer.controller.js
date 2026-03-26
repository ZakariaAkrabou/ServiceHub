import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";

export const searchServices = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res
        .status(400)
        .json({ success: false, message: "Keyword is required." });
    }
    const services = await Service.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    }).populate("provider_id", "name email");

    if (services.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No services found matching your search criteria.",
        });
    }
    res
      .status(200)
      .json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterServices = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
      availability,
    } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }


    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (availability) {
      filter.availability = availability;
    }

    const services = await Service.find(filter)
      .populate("provider_id", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { service_id, booking_time } = req.body;

    const service = await Service.findById(service_id);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });

    if (new Date(booking_time) < new Date())
      return res
        .status(400)
        .json({ success: false, message: "The date must be in the future." });

    const conflict = await Booking.findOne({
      service_id,
      booking_time: new Date(booking_time),
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict)
      return res
        .status(409)
        .json({ success: false, message: "This slot is already booked." });

    const booking = await Booking.create({
      customer_id: userId,
      service_id,
      booking_time: new Date(booking_time),
    });

    res
      .status(201)
      .json({ success: true, message: "Booking created.", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    let bookings;

    if (req.user.role === "customer") {
      bookings = await Booking.find({ customer_id: userId })
        .populate("service_id", "title description price")
        .sort({ booking_time: -1 });
    } else if (req.user.role === "provider") {
      const myServices = await Service.find({ provider_id: userId }).select(
        "_id",
      );
      const serviceIds = myServices.map((s) => s._id);
      bookings = await Booking.find({ service_id: { $in: serviceIds } })
        .populate("customer_id", "name email")
        .populate("service_id", "title price")
        .sort({ booking_time: -1 });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });
    }

    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
      });

    const booking = await Booking.findById(id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    if (req.user.role === "customer") {
      if (status !== "cancelled")
        return res
          .status(403)
          .json({ success: false, message: "A customer can only cancel." });
      if (String(booking.customer_id) !== String(userId))
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
    }

    if (req.user.role === "provider") {
      const service = await Service.findById(booking.service_id);
      if (!service || String(service.provider_id) !== String(userId))
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Status updated: ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
