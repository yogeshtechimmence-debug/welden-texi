import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  id: { type: Number, unique: true },
  customer_id: { type: Number },
  driver_id: { type: Number },
  type: { type : String },
  request_id: { type: mongoose.Schema.Types.ObjectId },
  current_location: { type: String },
  current_lat: { type: String },
  current_lng: { type: String },
  destination_location: { type: String },
  destination_lat: { type: String },
  destination_lng: { type: String },
  price: { type: String },
  distance: { type: String },
  distance_meter: { type: String },
  time: { type: String },
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

  tracking_active: {
    type: Boolean,
    default: false,
  },

  last_location_update: {
    type: Date,
    default: null,
  },

  location_updates: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      location: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  status: {
    type: String,
    enum: [
      "Pending",
      "Accept",
      "Propose",
      "Cancelled",
      "Start",
      "Complete",
      "Decline",
    ],
    default: "Pending",
  },
},
{
 timestamps: true
}
);

export default mongoose.model("booking", bookingSchema);
