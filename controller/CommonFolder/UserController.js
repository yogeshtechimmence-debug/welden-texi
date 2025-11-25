import User from "../../Model/CommonModel/UserModel.js";
import bcrypt from "bcrypt";

export const UserSignUp = async (req, res) => {
  try {
    const { type, first_name, last_name, contact_number, email, password } =
      req.query;

    if (!type) {
      return res.status(400).json({
        status: "0",
        message: "type required",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: "0",
        message: "Email already exists",
      });
    }

    const existingMobile = await User.findOne({ contact_number });
    if (existingMobile) {
      return res.status(400).json({
        status: "0",
        message: "Mobile already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    const userData = new User({
      id: newId,
      type: type.toUpperCase(),
      first_name,
      last_name,
      contact_number,
      email,
      password: hashedPassword,
    });

    await userData.save();

    res.status(200).json({
      status: "true",
      message: "Sign up successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      status: "0",
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};

export const UserLogin = async (req, res) => {
  try {
    const { contact_number, password } = req.query;

    if (!contact_number || !password) {
      return res.status(400).json({
        status: "0",
        message: "Please provide contact number and password",
      });
    }

    const user = await User.findOne({ contact_number });
    if (!user) {
      return res.status(400).json({
        status: "0",
        message: "Mobile number is not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "0",
        message: "Incorrect password",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};
