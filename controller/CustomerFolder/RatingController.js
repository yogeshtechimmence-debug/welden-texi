import UserModel from "../../Model/CommonModel/UserModel.js";
import Rating from "../../Model/CustomerModel/RatingModel.js";
import DriverRating from "../../Model/DriverModel/DriverRating.js";

export const SendRating = async (req, res) => {
  try {
    const { customer_id, driver_id, rating, review } = req.query;

    if (!customer_id || !driver_id || !review) {
      return res.status(400).json({
        status: 0,
        message: "customer_id, driver_id and review are required",
      });
    }

    const CustomerData = await UserModel.findOne({ id: Number(customer_id) });
    const DriverData = await UserModel.findOne({ id: Number(driver_id) });

    const lastRating = await Rating.findOne().sort({ id: -1 });
    const newId = lastRating ? lastRating.id + 1 : 1;

    const ratingData = new Rating({
      id: newId,
      customer_id,
      driver_id,
      customer_image: CustomerData.image,
      customer_name: `${CustomerData.first_name} ${CustomerData.last_name}`,
      customer_contact: CustomerData.contact_number,
      driver_image: DriverData.image,
      driver_name: `${DriverData.first_name} ${DriverData.last_name}`,
      driver_contact: DriverData.contact_number,
      rating: Number(rating),
      review,
    });

    await ratingData.save();

    let driverRating = await DriverRating.findOne({ driver_id });

    if (!driverRating) {
      driverRating = new DriverRating({
        driver_id,
        average_rating: Number(rating),
        total_rating: 1
      });
    } else {
      const newTotal = driverRating.total_rating + 1;
      const newAvg = (driverRating.average_rating * driverRating.total_rating + Number(rating)) / newTotal;

      driverRating.average_rating = newAvg;
      driverRating.total_rating = newTotal;
    }

    await driverRating.save();

    return res.status(200).json({
      status: 1,
      message: "Rating submitted successfully",
      result: ratingData
    });

  } catch (error) {
    console.error("Create Rating Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

export const GetDriverRatings = async (req, res) => {
  try {
    const { driver_id } = req.query;

    if (!driver_id) {
      return res.status(400).json({
        status: 0,
        message: "driver_id required",
      });
    }

    const ratings = await Rating.find({ driver_id: Number(driver_id) }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      status: 1,
      message: "Driver ratings fetched successfully",
      result: ratings,
    });
  } catch (error) {
    console.error("Get Driver Ratings Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getsingleDriverRating = async (req, res) => {
  try {
    const { driver_id } = req.query;

    if (!driver_id) {
      return res.status(400).json({
        status: 0,
        message: "driver_id is required",
      });
    }

    const driverRating = await DriverRating.findOne({ driver_id: Number(driver_id) });

    if (!driverRating) {
      return res.status(200).json({
        status: 1,
        message: "No rating found for this driver",
        result: {
          driver_id,
          average_rating: 0,
          total_rating: 0,
        },
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Driver rating fetched successfully",
      result: driverRating,
    });

  } catch (error) {
    console.error("Driver Rating Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });
  }
};
