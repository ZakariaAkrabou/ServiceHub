import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    recipient_role: {
      type: String,
      enum: ["admin", "customer", "service_provider"],
      required: true,
      default: "service_provider",
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
    },
    type: {
      type: String,
      enum: [
        "new_booking",
        "booking_updated",
        "booking_cancelled",
        "new_provider",
        "new_service",
        "provider_approved",
        "provider_rejected",
      ],
      required: true,
    },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
