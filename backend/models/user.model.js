import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin","customer", "service_provider"],
      default: "customer",
    },
    serviceDescription: {
      type: String,
      required: function () {
        return this.role === "service_provider";
      },
      ion() {
        return this.role === "service_provider";
      },
    },
    serviceCategory: {
      type: [String],
    
      required: function () {
        return this.role === "service_provider";
      },
      ion() {
        return this.role === "service_provider";
      },
      default:undefined,
    },
    location: {
      type: String,
      required: function () {
        return this.role === "service_provider";
      },
      ion() {
        return this.role === "service_provider";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.role === "service_provider";
      },
      ion() {
        return this.role === "service_provider";
      },
      trim: true,
    },
    image: {
      type: String,
      default:undefined,
      
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default:undefined,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
