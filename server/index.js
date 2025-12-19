import express from "express";
import config from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import users from "./src/routes/user.routes.js";
import connectDB from "./src/config/db.js"

connectDB();
const app = express();

app.use(morgan(config.node_env === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors_options))

app.use("/api/users", users);

app.get("/", (req, res) => res.send("API is live"));

app.listen(config.port, () => console.log(`express server is live on port ${+config.port}`));
