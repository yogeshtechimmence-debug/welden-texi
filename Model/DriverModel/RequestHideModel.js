import mongoose from "mongoose";

const requestHideSchema = mongoose.Schema({
  driver_id: { type: Number },
  request_id: { type: mongoose.Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now }
},
{
  timestamps : true
}
);

export default mongoose.model("requesthide", requestHideSchema);


