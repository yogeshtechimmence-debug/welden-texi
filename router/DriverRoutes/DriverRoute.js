import express from "express";
import { addVehicleInfo } from "../../controller/DriverFolder/VehicleInformation.js";
import upload from "../../middleware/upload.js";
import { AcceptRequest, DeclineRequest, getAllRequests, UpdateDriverLocation } from "../../controller/DriverFolder/RequestController.js";
import { CancelBooking, CompleteBooking, getDriverBooking, MarkStart } from "../../controller/DriverFolder/DriverBooking.js";
import {  getsingleDriverRating } from "../../controller/CustomerFolder/RatingController.js";

const router = express.Router();

// ----------------- vehicle information Controller -------------------
router.post("/add_vehicle_info",
upload.fields([
    { name: "front_license", maxCount: 1 },
    { name: "back_license", maxCount: 1 },
    { name: "selfie_license", maxCount: 1 },
    { name: "front_identity_document", maxCount: 1 },
    { name: "back_identity_document", maxCount: 1 },
    { name: "selfie_identity_document", maxCount: 1 },
 ]),
 addVehicleInfo
);

// ----------------- request Controller -------------------
router.get("/get_request", getAllRequests);
router.post("/accept_request", AcceptRequest);

// ----------------- Booking Controller -------------------
router.get("/get_driver_booking", getDriverBooking)
router.post("/cancel_booking", CancelBooking)
router.post("/mark_start", MarkStart)
router.post("/booking_complete", CompleteBooking)
router.post("/decline_request", DeclineRequest)

// ----------------- get driver rating -------------------
router.get("/get_driver_ratings", getsingleDriverRating);

// ----------------- update lat lng 3 secound -------------------
router.post("/update_location", UpdateDriverLocation);

export default router;
       
