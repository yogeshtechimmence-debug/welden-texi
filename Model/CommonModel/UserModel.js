import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  id: { type: Number, unique: true },
  type: { type: String, enum: ["CUSTOMER", "DRIVER"], required: true },
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  contact_number: { type: String },
  email: { type: String },
  password: { type: String },
  image: { type: String },

  // OTP fields
    otpHash: { type: String },
    otpExpires: { type: Date },
});

export default mongoose.model("user", UserSchema);
