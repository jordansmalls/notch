import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  //TODO: configure cors
};

const config = {
  port: process.env.PORT || 4000,
  jwt_secret: process.env.JWT_SECRET,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  cors_options: corsOptions,
};

export default config;
