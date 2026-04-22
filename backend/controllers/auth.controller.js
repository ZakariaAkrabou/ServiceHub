import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    serviceDescription,
    serviceCategory,
    location,
    phone,
    image,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "customer",
    };

    if (role === "service_provider") {
      let imageUrl = "";
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "service_hub_profiles",
          resource_type: "image",
        });
        imageUrl = uploadResponse.secure_url;
      }

      newUserData.serviceDescription = serviceDescription;
      newUserData.serviceCategory = serviceCategory;
      newUserData.location = location;
      newUserData.phone = phone;
      newUserData.image = imageUrl;
      newUserData.isVerified = false;
      newUserData.status = "pending";
    }

    const newUser = new User(newUserData);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = verificationToken;

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

    const emailSubject = "Verify Your Email Address";
    const emailText = `Please click the following link to verify your email: ${verificationLink}`;
    const emailHtml = `<p>Please click the following link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`;

    await sendEmail(email, emailSubject, emailText, emailHtml);

    res.status(201).json({
      message:
        role === "service_provider"
          ? "Service provider registered successfully. Await admin verification."
          : "User registered successfully. Please check your email for verification.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email successfully verified!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account is banned",
        reason: user.banInfo?.reason,
        duration: user.banInfo?.duration,
        expiresAt: user.banInfo?.expiresAt,
      });
    }
    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found with that email address" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
    const resetLink = `${frontendUrl}/admin/reset-password/${resetToken}`;

    const emailSubject = "Password Reset Request";
    const emailText = `You requested a password reset. Please click the following link to reset your password: ${resetLink}`;
    const emailHtml = `<p>You requested a password reset. Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`;

    await sendEmail(email, emailSubject, emailText, emailHtml);

    res
      .status(200)
      .json({ message: "Password reset email sent. Please check your inbox." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
