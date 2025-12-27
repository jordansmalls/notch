// import {
//     createCounter,
//     resetCounter,
//     deleteCounter,
//     fetchUserCounters,
//     readCurrentCount,
//     incrementCount
// } from "../controllers/counter.controller.js"
// import { protect } from "../middlewares/auth.middleware.js"
// import express from "express"
// const router = express.Router()

// /**
//  * @desc    Create counter
//  * @route   POST /api/counters/
//  * @access  PRIVATE
//  */
// router.post("/", protect, createCounter)

// /**
//  * @desc    Reset counter
//  * @route   POST /api/counters/:id/reset
//  * @access  PRIVATE
//  */
// router.post("/:id/reset", protect, resetCounter)

// /**
//  * @desc    Delete counter
//  * @route   DELETE /api/counters/:id
//  * @access  PRIVATE
//  */
// router.delete("/:id", protect, deleteCounter)

// /**
//  * @desc    Fetch all user counters
//  * @route   GET /api/counters/
//  * @access  PRIVATE
//  */
// router.get("/", protect, fetchUserCounters)

// // PUBLIC

// /**
//  * @desc    Read current count
//  * @route   GET /api/counters/:public_key
//  * @access  PUBLIC
//  */
// router.get("/:public_key", readCurrentCount)

// /**
//  * @desc    Increment count
//  * @route   POST /api/counters/:public_key/increment
//  * @access  PUBLIC
//  */
// router.post("/:public_key/increment", incrementCount)

// export default router;

import express from "express";
import {
  createCounter,
  updateCounter,
  resetCounter,
  deleteCounter,
  fetchUserCounters,
  readCurrentCount,
  incrementCount,
  deleteAllUserCounters,
} from "../controllers/counter.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { incrementLimiter, counterReadLimiter, lightLimiter, strictLimiter } from "../utils/rate.limiting.js"

const router = express.Router();

// --- PRIVATE ROUTES ---

router
  .route("/")
  .post(protect, strictLimiter, createCounter)
  .get(protect, lightLimiter, fetchUserCounters)
  .patch(protect, lightLimiter, updateCounter)
  .delete(protect, strictLimiter, deleteAllUserCounters )

router.route("/:id").delete(protect, strictLimiter, deleteCounter);
router.post("/:id/reset", protect, lightLimiter, resetCounter);

// --- PUBLIC ROUTES ---

router.get("/public/:public_key", counterReadLimiter, readCurrentCount);
router.post("/public/:public_key", incrementLimiter,incrementCount);

export default router;