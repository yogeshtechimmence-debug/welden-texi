import Request from "../../Model/DriverModel/RequestModel.js";
import User from "../../Model/CommonModel/UserModel.js";

// find driver and send location and proice
export const findDriver = async (req, res) => {
  try {
    const {
      customer_id,
      current_location,
      current_lat,
      current_lng,
      destination_location,
      destination_lat,
      destination_lng,
      distance,
      distance_meter,
      price,
    } = req.query;

    const customerData = await User.findOne({ id: Number(customer_id) });
    if (!customerData) {
      return res.status(404).json({
        status: 0,
        message: "Customer not found",
      });
    }

    const existingRequest = await Request.findOne({
      customer_id: Number(customer_id),
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(200).json({
        status: 0,
        message: "You have already sent a request",
        result: existingRequest,
      });
    }

    const lastRequest = await Request.findOne().sort({ id: -1 });
    const newId = lastRequest ? lastRequest.id + 1 : 1;

    const requestData = new Request({
      id: newId,
      customer_id: customerData.id,
      current_location,
      current_lat,
      current_lng,
      destination_location,
      destination_lat,
      destination_lng,
      distance,
      distance_meter,
      price,
      customer_image: customerData.image,
      customer_name: `${customerData.first_name} ${customerData.last_name}`,
      customer_contact: customerData.contact_number,
      status: "PENDING",
    });

    await requestData.save();

    return res.status(200).json({
      status: 1,
      message: "Driver search request created successfully",
      result: requestData,
    });
  } catch (error) {
    console.error("Find Driver Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

// get single request data customer side
export const getSingleRequestById = async (req, res) => {
  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({
        status: 0,
        message: "customer_id is required",
      });
    }

    const requestData = await Request.findOne({
      customer_id: customer_id,
    });

    if (!requestData) {
      return res.status(404).json({
        status: 0,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Request fetched successfully",
      result: requestData,
    });
  } catch (error) {
    console.error("Get Request Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

// request priice increament and dicreament
export const updateRequestPrice = async (req, res) => {
  try {
    let { request_id, operator, value } = req.query;

    if (!request_id || !operator || !value) {
      return res.status(400).json({
        status: 0,
        message: "request_id, operator (+/-) and value required",
      });
    }

    if (operator === " " || operator === "" || operator === undefined) {
      operator = "+";
    }

    const requestData = await Request.findOne({ id: Number(request_id) });

    if (!requestData) {
      return res.status(404).json({
        status: 0,
        message: "Request not found",
      });
    }

    let newPrice = Number(requestData.price);

    if (operator === "+") {
      newPrice += Number(value);
    } else if (operator === "-") {
      newPrice -= Number(value);
      if (newPrice < 0) newPrice = 0;
    } else {
      return res.status(400).json({
        status: 0,
        message: "Invalid operator, use + or -",
      });
    }

    requestData.price = newPrice;
    await requestData.save();

    return res.status(200).json({
      status: 1,
      message: "Price updated successfully",
      result: requestData,
    });
  } catch (error) {
    console.error("Update Price Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

// cancel request customer side
export const CancelRequest = async (req, res) => {
  try {
    const { request_id } = req.query;

    if (!request_id) {
      return res.status(400).json({
        status: 0,
        message: "Request request_id is required",
      });
    }

    const deletedRequest = await Request.findOneAndDelete({
      id: Number(request_id),
    });

    if (!deletedRequest) {
      return res.status(404).json({
        status: 0,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Request deleted successfully",
      deleted: deletedRequest,
    });
  } catch (error) {
    console.error("Delete Request Error:", error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

// find near drivers
export const FindNearDrivers = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        status: "0",
        message: "lat & lng is required",
      });
    }

    const drivers = await User.find({
      type: "DRIVER",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: 10000, // 10 KM
        },
      },
    });

    return res.status(200).json({
      status: "1",
      message: "Near drivers fetched successfully",
      result: drivers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "0",
      message: "Server error",
    });
  }
};
