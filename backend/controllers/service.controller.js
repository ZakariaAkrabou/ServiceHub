import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";
import Notification from "../models/notification.model.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ provider_id: req.user.userId })
      .populate("provider_id", "firstName last_name email")
      .lean();

    if (services.length === 0) {
      return res
        .status(200)
        .json({
          success: false,
          message: "You have not created any services yet.",
        });
    }

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file && req.file.cloudinaryUrl) {
      imageUrl = req.file.cloudinaryUrl;
    }

   
    const newService = new Service({
      provider_id: req.user.userId,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      hidden: req.body.hidden === "true",
      image: imageUrl,
    });
    const savedService = await newService.save();

    const notification = await Notification.create({
      recipient_role: "admin",
      service_id: savedService._id,
      type: "new_service",
      message: `New service created: "${savedService.name}"`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("newNotification", notification);
    }

    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider_id",
      "first_name last_name email",
    );
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.provider_id._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

   
    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.category !== undefined)
      updateData.category = req.body.category;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.hidden !== undefined)
      updateData.hidden = req.body.hidden === "true";

    
    if (req.file && req.file.cloudinaryUrl) {
      updateData.image = req.file.cloudinaryUrl;
    }
 

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status === status) {
      return res.status(400).json({
        success: false,
        message: "Booking already has this status.",
      });
    }

    if (req.user.role === "customer") {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customer can only cancel bookings.",
        });
      }

      if (String(booking.customer_id) !== String(userId)) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "You can only cancel pending bookings.",
        });
      }
    }

    let service;

    if (req.user.role === "provider") {
      service = await Service.findById(booking.service_id);

      if (!service || String(service.provider_id) !== String(userId)) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      if (booking.status === "pending") {
        if (!["confirmed", "cancelled"].includes(status)) {
          return res.status(400).json({
            success: false,
            message: "From pending, only confirmed or cancelled allowed.",
          });
        }
      } else if (booking.status === "confirmed") {
        if (status !== "completed") {
          return res.status(400).json({
            success: false,
            message: "From confirmed, only completed allowed.",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "This booking can no longer be updated.",
        });
      }
    }

    booking.status = status;

    if (status === "confirmed") booking.confirmedAt = new Date();
    if (status === "completed") booking.completedAt = new Date();
    if (status === "cancelled") booking.cancelledAt = new Date();

    await booking.save();

    const io = req.app.get("io");

    let notifications = [];

    if (req.user.role === "provider") {
      let message = "";

      if (status === "confirmed") {
        message = "Your booking has been accepted.";
      } else if (status === "completed") {
        message = "Your booking has been completed.";
      } else if (status === "cancelled") {
        message = "Your booking was rejected by the provider.";
      }

      const notif = await Notification.create({
        user_id: booking.customer_id,
        booking_id: booking._id,
        type: "booking_updated",
        message,
      });

      notifications.push({
        userId: booking.customer_id,
        data: notif,
      });
    }

    if (req.user.role === "customer") {
      const serviceData = await Service.findById(booking.service_id);

      const notif = await Notification.create({
        user_id: serviceData.provider_id,
        booking_id: booking._id,
        type: "booking_cancelled",
        message: "A customer cancelled a booking.",
      });

      notifications.push({
        userId: serviceData.provider_id,
        data: notif,
      });
    }

    notifications.forEach((n) => {
      io.to(n.userId.toString()).emit("bookingUpdate", {
        booking_id: n.data.booking_id,
        message: n.data.message,
        type: n.data.type,
      });
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user?.userId;
    if (!providerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const services = await Service.find({ provider_id: providerId })
      .select("_id")
      .lean();
    const serviceIds = services.map((s) => s._id);

    const bookings = await Booking.find({ service_id: { $in: serviceIds } })
      .populate("customer_id", "firstName lastName email")
      .populate("service_id", "name price category")
      .sort({ booking_time: -1 })
      .lean();

    if (bookings.length === 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "No bookings found for your services.",
        });
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Provider bookings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//notify provider
export const getProviderNotifications = async (req, res) => {
  try {
    const providerId = req.user.userId;

    const notifications = await Notification.find({ user_id: providerId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markProviderNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user_id: providerId },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllProviderNotificationsRead = async (req, res) => {
  try {
    const providerId = req.user.userId;

    await Notification.updateMany(
      { user_id: providerId, is_read: false },
      { is_read: true }
    );

    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

