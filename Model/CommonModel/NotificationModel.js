import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    customer_id: { type: String },
    driver_id: { type: String },
    type: { type: String },
    title: { type: String },
    discription: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("notification", NotificationSchema);
