import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import path from "path";
import routes from './router/AllRoutes/AllRoutes.js';

dotenv.config();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/welden-texi/api", routes);

MongoDb();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(chalk.green(`Server running on port ${PORT} ${figures.tick}`));
});
