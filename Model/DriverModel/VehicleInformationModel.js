import mongoose from "mongoose";

const VehicleInformationSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  driverId: { type: Number },
  brand: { type: String },
  color: { type: String },
  registration_number: { type: String },
  plate_number: { type: String },
  front_license: { type: String },
  back_license: { type: String },
  selfie_license: { type: String },
  front_identity_document: { type: String },
  back_identity_document: { type: String },
  selfie_identity_document: { type: String },
},
{
  timestamps: true
});

export default mongoose.model("vehicleInformation", VehicleInformationSchema);
