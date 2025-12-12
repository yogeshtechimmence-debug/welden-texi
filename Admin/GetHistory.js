import History from '../Model/CommonModel/HistoryModel.js';

export const getHistory = async (req, res) => {
  try {
    const HistoryData = await History.find().sort({ _id: -1 });

    return res.status(200).json({
      status: "1",
      message: "fetch history data",
      result: HistoryData,
    });

  } catch (error) {
    return res.status(500).json({
      status: "0",
      message: "Internal server error",
      error: error.message,
    });
  }
};
