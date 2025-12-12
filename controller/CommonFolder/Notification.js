import Notification from "../../Model/CommonModel/NotificationModel.js";

export const getNotification = async (req, res) => {
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

    const NotificationData = await Notification.find(filter);

    res.status(200).json({
      status: "1",
      message: "Notification fetch successfully",
      result: NotificationData,
    });

  } catch (error) {
    res.status(500).json({
      status: "0",
      message: "server error",
      error: error.message,
    });
  }
};
