import express from "express";
import commonRoutes from "../CommonRoutes/CommonRoutes.js";
import driverRoute from "../DriverRoutes/DriverRoute.js";
import customerRoute from "../CustomerRoutes/CustomerRoute.js";
import RazorpayRoute from "../RazorpayRoutes/RazorpayRoute.js";

const router = express.Router();

router.use(commonRoutes);
router.use(driverRoute);
router.use(customerRoute);
router.use(RazorpayRoute);

export default router;
