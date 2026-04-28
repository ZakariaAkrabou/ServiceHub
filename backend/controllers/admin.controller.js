import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import mongoose from "mongoose";

export const allUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [totalUsers, users] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.find({ role: { $ne: "admin" } }, "-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const customerIds = [];
    const providerIds = [];

    for (const user of users) {
      if (user.role === "customer") customerIds.push(user._id);
      else if (user.role === "service_provider") providerIds.push(user._id);
    }

   
    const providerObjectIds = providerIds.map(
      (id) => new mongoose.Types.ObjectId(id.toString()),
    );
    const customerObjectIds = customerIds.map(
      (id) => new mongoose.Types.ObjectId(id.toString()),
    );

    const [customerBookingCounts, providerStats] = await Promise.all([
      customerObjectIds.length
        ? Booking.aggregate([
            { $match: { customer_id: { $in: customerObjectIds } } },
            { $group: { _id: "$customer_id", count: { $sum: 1 } } },
          ])
        : [],
      providerObjectIds.length
        ? Service.aggregate([
            { $match: { provider_id: { $in: providerObjectIds } } },
            {
              $group: {
                _id: "$provider_id",
                serviceCount: { $sum: 1 },
                totalRating: { $sum: "$rating" },
                ratingCount: {
                  $sum: { $cond: [{ $gt: ["$rating", 0] }, 1, 0] },
                },
              },
            },
          ])
        : [],
    ]);

   
    const customerCountMap = Object.fromEntries(
      customerBookingCounts.map(({ _id, count }) => [_id.toString(), count]),
    );

    
    const providerStatsMap = Object.fromEntries(
      providerStats.map((stat) => [stat._id.toString(), stat]),
    );

   
    const providerServices = providerObjectIds.length
      ? await Service.find(
          { provider_id: { $in: providerObjectIds } },
          "_id provider_id",
        ).lean()
      : [];

    const serviceToProvider = Object.fromEntries(
      providerServices.map((s) => [s._id.toString(), s.provider_id.toString()]),
    );
    const serviceIds = providerServices.map((s) => s._id);

    const providerBookingCounts = serviceIds.length
      ? await Booking.aggregate([
          { $match: { service_id: { $in: serviceIds } } },
          { $group: { _id: "$service_id", count: { $sum: 1 } } },
        ])
      : [];

    const providerBookingCountMap = {};
    for (const { _id, count } of providerBookingCounts) {
      const providerId = serviceToProvider[_id.toString()];
      if (providerId) {
        providerBookingCountMap[providerId] =
          (providerBookingCountMap[providerId] ?? 0) + count;
      }
    }

    const usersWithStats = users.map((user) => {
      const id = user._id.toString();
      let jobsCompleted = 0;
      let serviceCount = 0;
      let rating = 0;

      if (user.role === "customer") {
        jobsCompleted = customerCountMap[id] ?? 0;
      } else if (user.role === "service_provider") {
        jobsCompleted = providerBookingCountMap[id] ?? 0;
        const stats = providerStatsMap[id];
        if (stats) {
          serviceCount = stats.serviceCount;
          rating = stats.ratingCount > 0 ? stats.totalRating / stats.ratingCount : 0;
        }
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        serviceCount,
        jobsCompleted,
        rating: Number(rating.toFixed(1)),
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A",
        specialty:
          user.serviceCategory &&
          (Array.isArray(user.serviceCategory)
            ? user.serviceCategory.length > 0
            : true)
            ? Array.isArray(user.serviceCategory)
              ? user.serviceCategory.join(", ")
              : user.serviceCategory
            : "N/A",
        serviceDescription: user.serviceDescription || "",
        isBanned: user.isBanned || false,
        banInfo: user.banInfo || null,
      };
    });

    return res.status(200).json({
      result: usersWithStats.length,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      data: usersWithStats,
    });
  } catch (error) {
    console.error("Error in allUsers:", error);
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

    if (status) filter.status = status;
    if (customerId) filter.customer_id = customerId;
    if (providerId) {
      const services = await Service.find({ provider_id: providerId });
      const serviceIds = services.map((service) => service._id);
      filter.service_id = { $in: serviceIds };
    }

    const bookings = await Booking.find(filter)
      .populate("customer_id", "firstName lastName email")
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

export const banUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { userId } = req.params;
    const { reason, duration } = req.body;

    if (!reason || !duration) {
      return res.status(400).json({
        message: "Reason and duration are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bannedAt = new Date();
    const expiresAt = new Date(
      bannedAt.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    user.isBanned = true;
    user.banInfo = {
      reason,
      duration,
      bannedAt,
      expiresAt,
    };

    await user.save();

    if (user.role === "service_provider") {
      await Service.updateMany(
        { provider_id: user._id },
        { $set: { hidden: true } },
      );
    }

    return res.status(200).json({
      message: "User banned successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    user.banInfo = null;

    await user.save();

    
    if (user.role === "service_provider") {
      await Service.updateMany(
        { provider_id: user._id },
        { $set: { hidden: false } },
      );
    }

    return res.status(200).json({
      message: "User unbanned successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "service_provider") {
      await Service.deleteMany({ provider_id: user._id });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
