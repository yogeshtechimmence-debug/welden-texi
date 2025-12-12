import mongoose from "mongoose";

const DriverRatingSchema = new mongoose.Schema({
  driver_id: { type: Number, unique: true },
  average_rating: { type: Number, default: 0 },
  total_rating: { type: Number, default: 0 }
},
{
  timestamps: true
});

export default mongoose.model("driver_rating", DriverRatingSchema);
