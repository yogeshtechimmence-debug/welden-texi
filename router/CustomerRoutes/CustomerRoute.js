import express from "express";
import {
  CancelRequest,
  findDriver,
  FindNearDrivers,
  getSingleRequestById,
  updateRequestPrice,
} from "../../controller/CustomerFolder/FindDriver.js";
import {
  AcceptPropose,
  declinePropose,
  getUserBooking,
} from "../../controller/CustomerFolder/UserBooking.js";
import {  GetDriverRatings, SendRating } from "../../controller/CustomerFolder/RatingController.js";

const router = express.Router();

// ----------------- user side Request -------------------
router.post("/find_driver", findDriver);

router.post("/delete_request", CancelRequest);

router.get("/get_single_request", getSingleRequestById);

router.get("/updateRequestPrice", updateRequestPrice);

router.get("/find_near_drivers", FindNearDrivers);


// ----------------- user Booking -------------------
router.get("/get_user_booking", getUserBooking);

router.post("/accept_propose", AcceptPropose);

router.post("/decline_propose", declinePropose);


// ----------------- user send rating -------------------
router.post("/send_rating", SendRating);

router.get("/driver_ratings", GetDriverRatings);




export default router;
