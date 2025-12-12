import Request from "../../Model/DriverModel/RequestModel.js";
import User from "../../Model/CommonModel/UserModel.js";
import Booking from "../../Model/CommonModel/BookingModel.js";
import NotificationModel from "../../Model/CommonModel/NotificationModel.js";

// show accepted booking data customer side and show propose data
export const getUserBooking = async (req, res) => {
  try {
    const { id, status } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Customer id is required",
      });
    }

    if (!status) {
      return res.status(400).json({ status: 0, message: "status is required" });
    }

    const Userbooking = await Booking.find({
      customer_id: Number(id),
      status: status,
    });

    if (!Userbooking.length) {
      return res.status(404).json({
        status: 0,
        message: "No Userbooking found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "UserBooking data fetched successfully",
      result: Userbooking,
    });
  } catch (error) {
    console.error("Get Single Request Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

// accept propose customer side
export const AcceptPropose = async (req, res) => {
  try {
    const { booking_id } = req.query;

    if (!booking_id) {
      return res.status(400).json({
        status: 0,
        message: "booking_id is required",
      });
    }

    const acceptPropose = await Booking.findById(booking_id);

    if (!acceptPropose) {
      return res.status(404).json({
        status: 0,
        message: "Booking not found",
      });
    }

    acceptPropose.status = "Accept";
    await acceptPropose.save();

    const sendNotification = new NotificationModel({
      customer_id: acceptPropose.customer_id,
      driver_id: acceptPropose.driver_id,
      title:"Request Accepted By Drive",
      discription: "Ride confirmed. Head towards the customer now.",

    })

    await sendNotification.save()

    await Request.findByIdAndDelete(acceptPropose.request_id);

    await Booking.deleteMany({
      status: "Propose",
      request_id: acceptPropose.request_id,
      _id: { $ne: acceptPropose._id },
    });

    return res.status(200).json({
      status: 1,
      message: "Propose Accepted Successfully",
      result: acceptPropose,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server Error",
      error: error.message,
    });
  }
};

// decline single propose
export const declinePropose = async (req, res) => {
  try {
    const { booking_id } = req.query;

    if (!booking_id) {
      return res.status(400).json({
        status: 0,
        message: "booking_id required",
      });
    }

    const deletedPropose = await Booking.findOneAndDelete({
      id: Number(booking_id),
    });

    if (!deletedPropose) {
      return res.status(404).json({
        status: 0,
        message: "Propose not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Propose declined & deleted successfully",
      data: deletedPropose,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};
