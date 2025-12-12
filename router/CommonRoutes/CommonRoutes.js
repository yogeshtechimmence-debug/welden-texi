import express from "express";
import upload from "../../middleware/upload.js";
import {
  UpdateProfile,
  UserLogin,
  UserProfile,
  UserSignUp,
} from "../../controller/CommonFolder/UserController.js";
import {
  changePassword,
  forgetPassword,
} from "../../controller/CommonFolder/UserForgetPassword.js";
import { CustomerMode, DriverMode } from "../../controller/CommonFolder/ModeChanged.js";
import { getNotification } from "../../controller/CommonFolder/Notification.js";
import { getHistory } from "../../controller/CommonFolder/History.js";

const router = express.Router();

// ----------------- login signup -------------------
router.post("/signup", upload.single("image"), UserSignUp);
router.post("/login", UserLogin);
router.get("/get_profile", UserProfile);
router.post("/update_profile", upload.single("image"), UpdateProfile);


// ----------------- forget password -------------------
router.post("/forget_password", forgetPassword);
router.post("/change_password", changePassword);


// ----------------- Mode Changed -------------------
router.post("/driver_mode", DriverMode)
router.post("/customer_mode", CustomerMode)


// ----------------- History -------------------
 router.get("/get_history", getHistory)


 // ----------------- notification -------------------
 router.get("/get_notification", getNotification)


export default router;
