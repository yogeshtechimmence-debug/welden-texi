import Booking from "../../Model/CommonModel/BookingModel.js";
import Request from "../../Model/DriverModel/RequestModel.js";
import User from "../../Model/CommonModel/UserModel.js";
import VehicleInfo from "../../Model/DriverModel/VehicleInformationModel.js";
import RequestHide from "../../Model/DriverModel/RequestHideModel.js";

// get all driver side find driver request
export const getAllRequests = async (req, res) => {
  try {
    const { driver_id } = req.query;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    let hiddenIds = [];

    if (driver_id) {
      const hiddenRequests = await RequestHide.find({
        driver_id: Number(driver_id),
        created_at: { $gte: oneHourAgo },
      });

      hiddenIds = hiddenRequests.map((h) => h.request_id);
    }

    const requests = await Request.find({
      _id: { $nin: hiddenIds },
    }).sort({ created_at: -1 });

    return res.status(200).json({
      status: 1,
      message: "Requests fetched successfully",
      result: requests,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

const generateBookingData = async ({
  request_id,
  driver_id,
  propose_price,
  time,
  driver_location,
  driver_lat,
  driver_lng,
  status,
}) => {
  const RequestData = await Request.findById(request_id);
  const driverData = await User.findOne({ id: Number(driver_id) });
  const vehicleData = await VehicleInfo.findOne({
    driverId: Number(driver_id),
  });

  const lastBooking = await Booking.findOne().sort({ id: -1 });
  const newId = lastBooking ? lastBooking.id + 1 : 1;

  const BookingData = new Booking({
    id: newId,
    customer_id: RequestData.customer_id,
    driver_id: driverData.id,
    request_id: RequestData._id,

    current_location: RequestData.current_location,
    current_lat: RequestData.current_lat,
    current_lng: RequestData.current_lng,

    destination_location: RequestData.destination_location,
    destination_lat: RequestData.destination_lat,
    destination_lng: RequestData.destination_lng,

    distance: RequestData.distance,
    distance_meter: RequestData.distance_meter,
    price: propose_price,

    propose_price: propose_price || "",
    time: time || "",

    customer_image: RequestData.customer_image,
    customer_name: RequestData.customer_name,
    customer_contact: RequestData.customer_contact,

    driver_image: driverData.image,
    driver_name: `${driverData.first_name} ${driverData.last_name}`,
    driver_contact: driverData.contact_number,

    driver_location: driver_location || "",
    driver_lat: Number(driver_lat),
    driver_lng: Number(driver_lng),

    driver_model: vehicleData.brand,
    driver_plate_number: vehicleData.plate_number,

    status,

    tracking_active: true,
    last_location_update: new Date(),

    location_updates: [
      {
        lat: Number(driver_lat),
        lng: Number(driver_lng),
        location: driver_location || "",
        timestamp: new Date(),
      },
    ],
  });

  await BookingData.save();
  return { BookingData, RequestData };
};

export const AcceptRequest = async (req, res) => {
  try {
    const {
      request_id,
      driver_id,
      time,
      propose_price,
      driver_location,
      driver_lat,
      driver_lng,
      status,
    } = req.query;

    // If Propose
    if (status === "Propose") {
      let booking = await Booking.findOne({
        driver_id: Number(driver_id),
        status: "Propose",
      });

      if (booking) {
        booking.propose_price = propose_price;
        await booking.save();

        return res.status(200).json({
          status: 1,
          message: "Propose price updated successfully",
          result: booking,
        });
      }

      const { BookingData } = await generateBookingData({
        request_id,
        driver_id,
        propose_price,
        time,
        driver_location,
        driver_lat,
        driver_lng,
        status,
      });

      return res.status(200).json({
        status: 1,
        message: "Booking created with proposed price",
        result: BookingData,
      });
    }

    // If Accept
    if (status === "Accept") {
      await Booking.deleteMany({
        driver_id: Number(driver_id),
        status: "Propose",
      });


      const { BookingData, RequestData } = await generateBookingData({
        request_id,
        driver_id,
        propose_price,
        time,
        driver_location,
        driver_lat,
        driver_lng,
        status,
      });

      await Request.findByIdAndDelete(RequestData._id);

      return res.status(200).json({
        status: 1,
        message: "Booking accepted successfully",
        result: {
          ...BookingData.toObject(),
          tracking_enabled: true,
          websocket_url: `ws://${process.env.SERVER_IP}:${process.env.PORT}`,
          customer_id: RequestData.customer_id,
        },
      });
    }
  } catch (error) {
    console.error("booking Request Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

export const UpdateDriverLocation = async (req, res) => {
  try {
    const { booking_id, driver_id } = req.query;
    const LAT = Number(req.query.lat);
    const LNG = Number(req.query.lng);
    const location = req.query.location || "";

    const booking = await Booking.findOne({
      id: Number(booking_id),
      driver_id: Number(driver_id),
      tracking_active: true,
    });

    if (!booking) {
      return res.status(404).json({
        status: 0,
        message: "Booking not found or tracking not active",
      });
    }

    await Booking.updateOne(
      { id: Number(booking_id), driver_id: Number(driver_id) },
      {
        $set: {
          driver_lat: LAT,
          driver_lng: LNG,
          last_location_update: new Date(),
        },
        $push: {
          location_updates: {
            $each: [
              {
                lat: LAT,
                lng: LNG,
                location: location,
                timestamp: new Date(),
              },
            ],
            $slice: 1,
          },
        },
      }
    );

    return res.status(200).json({
      status: 1,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Location Update Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

export const DeclineRequest = async (req, res) => {
  try {
    const { driver_id, request_id } = req.query;

    if (!driver_id || !request_id) {
      return res.status(400).json({
        status: 0,
        message: "driver_id and request_id required",
      });
    }

    const hide = new RequestHide({
      driver_id: Number(driver_id),
      request_id: request_id,
    });

    await hide.save();

    return res.status(200).json({
      status: 1,
      message: "Request hidden successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};
