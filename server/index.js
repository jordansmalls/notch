import express from "express"
import config from "./src/config/config.js"
import morgan from "morgan";
import cors from "cors"
import compression from "compression"


const app = express()
const PORT = +config.port;


app.use(morgan(config.node_env === "production" ? "combined" : "dev"));
app.use(compression());
//TODO: configure cors
// app.use(cors(config.cors_options))






app.get("/", (req, res) => res.send("API is live"))


app.listen(PORT => console.log(`express server is live on port ${PORT}`))