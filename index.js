import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import path from "path";
import { createServer } from "http";
import routes from "./router/AllRoutes/AllRoutes.js";
import AdminRoutes from './router/AdminRoutes/AdminRoute.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/razorpay-webhook", bodyParser.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/welden-texi/api", routes);
app.use("/welden-texi/api/admin", AdminRoutes);

MongoDb();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(chalk.green(`Server running on port ${PORT} ${figures.tick}`));
});
