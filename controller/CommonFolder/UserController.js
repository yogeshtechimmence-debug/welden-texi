import User from "../../Model/CommonModel/UserModel.js";
import bcrypt from "bcrypt";
import VehicleInfo from "../../Model/DriverModel/VehicleInformationModel.js";

export const UserSignUp = async (req, res) => {
  try {
    const {
      type,
      first_name,
      last_name,
      contact_number,
      email,
      password,
      location,
      lat,
      lng,
      fcm_token,
    } = req.body;

    if (!type) {
      return res.status(400).json({
        status: "0",
        message: "type required",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: "0", message: "Email already exists" });
    }
    const existingMobile = await User.findOne({ contact_number });
    if (existingMobile) {
      return res
        .status(400)
        .json({ status: "0", message: "Mobile already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const formatDate = () => {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

    const userData = new User({
      id: newId,
      account_id: "",
      account_details_status: "No",
      type: type.toUpperCase(),
      first_name,
      last_name,
      contact_number,
      email,
      password: hashedPassword,
      image: imageUrl,
      lat,
      lng,
      location: {
        type: "Point",
        location: location,
        coordinates: [Number(lng), Number(lat)],
      },
      fcm_token,
      mobile_with_code: `+91${contact_number}`,
      country_id: "",
      state_id: "",
      state_name: "",
      city_id: "",
      city_name: "",
      social_id: "",
      gender: "",
      wallet: "0",
      earn_points: "0",
      referal_points: "0",
      booking_points: "0",
      referral_code: `${first_name}${contact_number.slice(5)}`,
      signup_referral_code: "",
      register_id: fcm_token,
      ios_register_id: "",
      status: "Active",
      approve_status: "No",
      available_status: "ONLINE",
      code: "",
      note: "",
      note_block: "",
      block_unblock: "Unblock",
      remove_status: "No",
      date_time: formatDate(),
    });

    await userData.save();

    res.status(200).json({
      status: "true",
      message: "Sign up successfully",
      result: userData,
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
    const { contact_number, password, type, fcmtoken, lat, lng } = req.body;

    if (!contact_number || !password || !type) {
      return res.status(400).json({
        status: "0",
        message: "Please provide contact number and password",
      });
    }

    const userType = type.toUpperCase();

    const user = await User.findOne({
      contact_number: contact_number,
      type: userType,
    });
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

    if (user.block_unblock === "Blocked") {
      return res.status(400).json({
        status: "0",
        message: "You are Blocked",
      });
    }

    if (user.approve_status === "No") {
      return res.status(400).json({
        status: "0",
        message: "Admin Not Aproved You Please wait",
      });
    }

    user.fcm_token = fcmtoken;
    user.lat = lat;
    user.lng = lng;

    await user.save();

    return res.status(200).json({
      status: "1",
      message: "Login successful",
      user: user,
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

export const UserProfile = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id is required",
      });
    }

    const UserData = await User.findOne({ id: Number(id) }).select(
      "-password -otpHash"
    );

    if (!UserData) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    const VehicleData = await VehicleInfo.findOne({
      driverId: Number(id),
    });

    return res.status(200).json({
      status: "1",
      message: "Profile fetched successfully",
      result: UserData,
      vehicle: VehicleData || null,
    });
  } catch (error) {
    console.error("Profile API Error:", error);

    return res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const {
      id,
      first_name,
      last_name,
      contact_number,
      email,
      location,
      lat,
      lng,
    } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id required",
      });
    }

    const user = await User.findOne({ id: Number(id) });

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (contact_number) updateData.contact_number = contact_number;
    if (email) updateData.email = email;
    if (location) updateData.location = location;
    if (lat) updateData.lat = lat;
    if (lng) updateData.lng = lng;

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: Number(id) },
      updateData,
      { new: true }
    );

    res.status(200).json({
      status: "1",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};
