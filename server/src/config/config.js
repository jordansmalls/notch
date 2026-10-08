import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gonotch.netlify.app",
  "https://jsmalls.net",
  "https://admin.jsmalls.net",
];

// public counter + global stats endpoints are open to any site; no cookies involved
const publicPaths = ["/api/counters/public/", "/api/global"];

const publicCorsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

// account + dashboard endpoints use cookies, so they stay limited to known frontends
const privateCorsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // reject without throwing so blocked origins get a normal response instead of a 500
    return callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const corsOptions = (req, callback) => {
  const isPublic = publicPaths.some((path) => req.path.startsWith(path));
  callback(null, isPublic ? publicCorsOptions : privateCorsOptions);
};

const config = {
  port: process.env.PORT || 4000,
  jwt_secret: process.env.JWT_SECRET,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  cors_options: corsOptions,
};

export default config;
