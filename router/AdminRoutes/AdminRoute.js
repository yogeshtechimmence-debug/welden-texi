import express from "express";
import { ApprovedUser, BlockUser, GetAllUser, sendMail } from "../../Admin/GetAllUser.js";
import { getHistory } from "../../Admin/GetHistory.js";
import { getAllBooking } from "../../Admin/GetAllBooking.js";
import { getAllRequest } from "../../Admin/GetAllRequest.js";
import {
  UpdateProfile,
  UserProfile,
  UserSignUp,
} from "../../controller/CommonFolder/UserController.js";
import upload from "../../middleware/upload.js";

const router = express.Router();
router.post("/add_customer", upload.single("image"), UserSignUp);
router.get("/get_all_user", GetAllUser);
router.get("/get_user_profile", UserProfile);
router.get("/update_profile", UpdateProfile);
router.post("/approved_user", ApprovedUser)
router.post("/block_user", BlockUser)
router.post("/send_mail", sendMail);



router.get("/get_all_complete", getHistory);
router.get("/get_all_booking", getAllBooking);
router.get("/get_all_request", getAllRequest);



export default router;
