import Booking from "../Model/CommonModel/BookingModel.js";

export const getAllBooking = async (req, res) => {
  const { status } = req.query;

  try {
    const proposeData = await Booking.find({ status: status }).sort({
      _id: -1,
    });

    return res.status(200).json({
      status: "1",
      message: "Propose data fetch successfully",
      result: proposeData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "0",
      message: "Internal server error",
      error: error.message,
    });
  }
};
