import express from "express";
import config from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import users from "./src/routes/user.routes.js";

const app = express();
const PORT = +config.port;

app.use(morgan(config.node_env === "production" ? "combined" : "dev"));
app.use(compression());
app.use(cookieParser());
//TODO: configure cors
// app.use(cors(config.cors_options))

app.use("/api/users", users);

app.get("/", (req, res) => res.send("API is live"));

app.listen((PORT) => console.log(`express server is live on port ${PORT}`));
