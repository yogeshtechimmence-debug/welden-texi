import History from "../../Model/CommonModel/HistoryModel.js";

export const getHistory = async (req, res) => {
  try {
    const { id, type } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id required",
      });
    }

    let filter = {};

    if (type === "DRIVER") {
      filter = { driver_id: Number(id) };
    } else if (type === "CUSTOMER") {
      filter = { customer_id: Number(id) };
    }

    const HistoryData = await History.find(filter);

    res.status(200).json({
      status: "1",
      message: "History fetch successfully",
      result: HistoryData,
    });

  } catch (error) {
    res.status(500).json({
      status: "0",
      message: "server error",
      error: error.message,
    });
  }
};

