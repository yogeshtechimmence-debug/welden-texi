import UserModel from "../../Model/CommonModel/UserModel.js";

export const DriverMode = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const driver = await UserModel.findOne({ id: Number(id) });
    if (!driver) {
      return res.status(400).json({ message: "driver not found" });
    }
    driver.type = "DRIVER";
    await driver.save();
    res.status(200).json({ message: "driver mode activated" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const CustomerMode = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const customer = await UserModel.findOne({ id: Number(id) });
    if (!customer) {
      return res.status(400).json({ message: "customer not found" });
    }
    customer.type = "CUSTOMER";
    await customer.save();
    res.status(200).json({ message: "customer mode activated" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const Mode = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const user = await UserModel.findOne({ id: Number(id) });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.type = user.type === "CUSTOMER" ? "DRIVER" : "CUSTOMER";

    await user.save();

    res.status(200).json({
      status: 1,
      message: `User type changed to ${user.type}`,
      newType: user.type,
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
};
