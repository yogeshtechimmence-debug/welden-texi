import UserModel from "../Model/CommonModel/UserModel.js";
import User from "../Model/CommonModel/UserModel.js";
import nodemailer from "nodemailer";

export const GetAllUser = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search = "" } = req.query;

    if (!type) {
      return res.status(400).json({
        status: "0",
        message: "type required",
      });
    }

    const skip = (page - 1) * limit;

    // Search filter
    const searchFilter = {
      type: type.toUpperCase(),
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contact_number: { $regex: search, $options: "i" } },
      ],
    };

    const totalCount = await User.countDocuments(searchFilter);

    const Userdata = await User.find(searchFilter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ id: -1 });

    return res.status(200).json({
      status: "1",
      message: "fetch user data",
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      result: Userdata,
    });
  } catch (error) {
    return res.status(500).json({
      status: "0",
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendMail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 0,
        message: "Email is required",
      });
    }

    // 1. Transporter create karo
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Mail details
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });

    return res.status(200).json({
      status: 1,
      message: "Mail sent successfully",
      info,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Something went wrong",
      error,
    });
  }
};

export const ApprovedUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id required",
      });
    }

    const user = await UserModel.findOne({ id: Number(id) });

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    user.approve_status = "Approved";
    await user.save();

    res.status(200).json({
      status: "1",
      message: "Status changed successfully",
      result: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

export const BlockUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id required",
      });
    }

    const user = await UserModel.findOne({ id: Number(id) });

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    user.block_unblock = user.block_unblock === "Blocked" ? "Unblock" : "Blocked";

    await user.save();

    res.status(200).json({
      status: "1",
      message: `User ${user.block_unblock} successfully`,
      result: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};
