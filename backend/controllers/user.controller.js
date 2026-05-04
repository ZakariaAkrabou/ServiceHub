import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .select("-password -verificationToken -resetPasswordToken")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "service_provider") {
      delete user.status;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = {};

    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "location",
      "serviceDescription",
      "serviceCategory",
      "image",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if ("role" in req.body) delete req.body.role;
    if ("status" in req.body) delete req.body.status;

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updates.password = hashedPassword;
    }

    if (req.body.image) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
        folder: "service_hub_profiles",
        resource_type: "image",
      });
      updates.image = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    ).select(
      "-password -verificationToken -resetToken -resetTokenExpiration -role",
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
