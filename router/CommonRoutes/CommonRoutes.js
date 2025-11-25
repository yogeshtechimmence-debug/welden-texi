// routes/chatRoutes.js
import express from "express";
import { UserSignUp } from "../../controller/CommonFolder/UserController.js";

const router = express.Router();

router.post("/signup", UserSignUp)

export default router;
