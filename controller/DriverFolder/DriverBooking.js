import Booking from "../../Model/CommonModel/BookingModel.js";
import Request from "../../Model/DriverModel/RequestModel.js";
import User from "../../Model/CommonModel/UserModel.js";
import VehicleInfo from "../../Model/DriverModel/VehicleInformationModel.js";
import HistoryModel from "../../Model/CommonModel/HistoryModel.js";
import NotificationModel from "../../Model/CommonModel/NotificationModel.js";

// show accepted booking data driver side
export const getDriverBooking = async (req, res) => {
  try {
    const { driver_id, status } = req.query;

    if (!driver_id) {
      return res.status(400).json({
        status: "0",
        message: "driver_id required",
      });
    }

    if (!status) {
      return res.status(400).json({
        status: "0",
        message: "status required",
      });
    }

    const driverBooking = await Booking.findOne({
      driver_id: Number(driver_id),
      status: status,
    });

    if (!driverBooking) {
      return res.status(404).json({
        status: "0",
        message: "No booking found",
      });
    }

    return res.status(200).json({
      status: "1",
      message: "Booking fetched successfully",
      result: driverBooking,
    });
  } catch (error) {
    console.error("Get Driver Booking Error:", error);
    return res.status(500).json({
      status: "0",
      message: "Server Error",
      error: error.message,
    });
  }
};

// cancel booking driver side
export const CancelBooking = async (req, res) => {
  const { booking_id } = req.query;

  const cancelBooking = await Booking.findById(booking_id);

  cancelBooking.status = "Cancelled";

  await cancelBooking.save();
  res.status(200).json({
    status: "1",
    message: "Booking cancelled Successfully",
    result: cancelBooking,
  });
};

// mark start driver side
export const MarkStart = async (req, res) => {
  const { booking_id } = req.query;

  const markStart = await Booking.findById(booking_id);

  markStart.status = "Start";

  await markStart.save();

  res.status(200).json({
    status: "1",
    message: "Booking MarkStart Successfully",
    result: markStart,
  });
};

// complate booking driver side
export const CompleteBooking = async (req, res) => {
  const { booking_id } = req.query;
  const compaleteBooking = await Booking.findById(booking_id);

  compaleteBooking.status = "Complete";

  await compaleteBooking.save();

  const lastHistory = await HistoryModel.findOne().sort({ id: -1 });
  const newId = lastHistory ? lastHistory.id + 1 : 1;
  const history = new HistoryModel({
    id: newId,
    customer_id: compaleteBooking.customer_id,
    driver_id: compaleteBooking.driver_id,
    request_id: compaleteBooking.request_id,
    current_location: compaleteBooking.current_location,
    current_lat: compaleteBooking.current_lat,
    current_lng: compaleteBooking.current_lng,
    destination_location: compaleteBooking.destination_location,
    destination_lat: compaleteBooking.destination_lat,
    destination_lng: compaleteBooking.destination_lng,
    distance: compaleteBooking.distance,
    distance_meter: compaleteBooking.distance_meter,
    price: compaleteBooking.price,
    propose_price: compaleteBooking.propose_price || " ",
    time: compaleteBooking.time || " ",
    customer_image: compaleteBooking.customer_image,
    customer_name: compaleteBooking.customer_name,
    customer_contact: compaleteBooking.customer_contact,
    driver_image: compaleteBooking.driver_image,
    driver_name: compaleteBooking.driver_name,
    driver_contact: compaleteBooking.driver_contact,
    driver_location: compaleteBooking.driver_location,
    driver_lat: compaleteBooking.driver_lat,
    driver_lng: compaleteBooking.driver_lng,
    driver_model: compaleteBooking.driver_model,
    driver_plate_number: compaleteBooking.driver_plate_number,
    status: compaleteBooking.status,
  });

  await history.save();

  const sendNotification = new NotificationModel({
    customer_id: compaleteBooking.customer_id,
    driver_id: compaleteBooking.driver_id,
    type: compaleteBooking.type,
    title: "Rate your driver",
    discription: "Help us improve by sharing your feedback",
  });

  await sendNotification.save();

  await Booking.findByIdAndDelete(booking_id)

  res.status(200).json({
    status: "1",
    message:
      "Your trip has been Successfully completed Thank you for riding with us Please take a moment to rate your driver and share your experience.",
    result: compaleteBooking,
  });
};

