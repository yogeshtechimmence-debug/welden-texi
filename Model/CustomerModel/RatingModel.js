import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    customer_id: { type: Number },
    driver_id: { type: Number },
    customer_image: { type: String },
    customer_name: { type: String },
    customer_contact: { type: String },
    driver_image: { type: String },
    driver_name: { type: String },
    driver_contact: { type: String },
    rating: { type: Number },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("rating", RatingSchema);
