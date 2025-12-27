import { fetchGlobalStatistics, fetchGlobalClicks, fetchGlobalUsers, fetchGlobalCounters } from "../controllers/global.controller.js"
import express from "express"
import { strictLimiter } from "../utils/rate.limiting.js"
const router = express.Router()

router.get("/", strictLimiter, fetchGlobalStatistics);
router.get("/clicks", strictLimiter, fetchGlobalClicks);
router.get("/users", strictLimiter, fetchGlobalUsers);
router.get("/counters", strictLimiter, fetchGlobalCounters);

export default router;