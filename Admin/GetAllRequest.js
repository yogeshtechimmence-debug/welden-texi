import Request from '../Model/DriverModel/RequestModel.js';

export const getAllRequest = async (req, res) => {
  try {
    const RequestData = await Request.find().sort({ _id: -1 });

    return res.status(200).json({
      status: "1",
      message: "Request data fetch successfully",
      result: RequestData,
    });

  } catch (error) {
    return res.status(500).json({
      status: "0",
      message: "Internal server error",
      error: error.message,
    });
  }
};

