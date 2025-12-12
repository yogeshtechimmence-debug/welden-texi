import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
  id: { type: Number },
  customer_id: { type: Number },
  driver_id: { type: Number },
  type: { type: String },
  current_location: { type: String },
  current_lat: { type: String },
  current_lng: { type: String },
  destination_location: { type: String },
  destination_lat: { type: String },
  destination_lng: { type: String },
  price: { type: String },
  distance: { type: String },
  distance_meter: { type: String },
  propose_price: { type: String },
  arrives_time: { type: String },
  customer_image: { type: String },
  customer_name: { type: String },
  customer_contact: { type: String },
  driver_image: { type: String },
  driver_name: { type: String },
  driver_contact: { type: String },
  driver_location: { type: String },
  driver_lat: { type: String },
  driver_lng: { type: String },
  driver_model: { type: String },
  driver_plate_number: { type: String },
  status: { type: String, default: "PENDING" },
},
{
  timestamps: true
});

export default mongoose.model("request", requestSchema);
