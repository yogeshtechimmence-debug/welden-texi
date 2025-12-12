import express from "express";
import { createOrder, RazorpayWebHook, verifyPayment } from "../../Razorpay/Payment.js";

const router = express.Router();

router.post("/create_order", createOrder)
router.post("/verify_payment", verifyPayment)
router.post("/web_hook", RazorpayWebHook)


      
export default router;
       
