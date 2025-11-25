// routes/chatRoutes.js
import express from "express";
import { UserLogin, UserSignUp } from "../../controller/CommonFolder/UserController.js";
import { changePassword, forgetPassword } from "../../controller/CommonFolder/UserForgetPassword.js";

const router = express.Router();

// ----------------- login signup -------------------
router.post("/signup", UserSignUp)
router.post("/login", UserLogin)


// ----------------- forget password -------------------
router.post("/forget_password", forgetPassword);
router.post("/change_password", changePassword);

export default router;
