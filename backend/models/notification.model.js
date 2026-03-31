import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    type: {
      type: String,
      enum: ["booking_created","booking_updated", "new_booking"],
      required: true,
    },
    message: { type: String, required: true },
  
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
