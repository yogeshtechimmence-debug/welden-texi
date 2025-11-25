// routes/chatRoutes.js
import express from "express";
import { UserLogin, UserSignUp } from "../../controller/CommonFolder/UserController.js";

const router = express.Router();

router.post("/signup", UserSignUp)
router.post("/login", UserLogin)

export default router;
