import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  //TODO: update for prod frontend url
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-app.com"
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const config = {
  port: process.env.PORT || 4000,
  jwt_secret: process.env.JWT_SECRET,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  cors_options: corsOptions,
};

export default config;
