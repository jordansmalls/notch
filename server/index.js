import express from "express";
import config from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import users from "./src/routes/user.routes.js";
import counters from "./src/routes/counter.routes.js"
import global from "./src/routes/global.routes.js"
import connectDB from "./src/config/db.js"

connectDB();
const app = express();

app.use(morgan(config.node_env === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors(config.cors_options))
// When running behind a proxy (e.g. Railway), trust the first proxy
if (config.node_env === "production") {
	app.set("trust proxy", 1);
}


app.use("/api/users", users);
app.use("/api/counters", counters);
app.use("/api/global", global)

app.get("/", (req, res) => res.send("API is live"));

app.listen(config.port, () => console.log(`express server is live on port ${+config.port}`));
