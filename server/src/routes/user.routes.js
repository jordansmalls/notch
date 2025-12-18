import express from "express";
import {
  createUserAccount,
  checkEmailAvailability,
  loginUserAccount,
  logoutUserAccount,
  deactivateUserAccount,
  fetchUserAccount,
  changeAccountPassword,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  lightLimiter,
  strictLimiter,
  emailCheckLimiter,
} from "../utils/rate.limiting.js";
const router = express.Router();

/**
 * @desc    Create user account
 * @route   POST /api/users/
 * @access  PUBLIC
 */
router.post("/", strictLimiter, createUserAccount);
/**
 * @desc    Check if an email is taken
 * @route   GET /api/users/check-email/:email
 * @access  PUBLIC
 */
router.get("/check-email/:email", emailCheckLimiter, checkEmailAvailability);
/**
 * @desc    Login user account
 * @route   POST /api/users/login
 * @access  PUBLIC
 */
router.post("/login", strictLimiter, loginUserAccount);

/**
 * @desc    Logout user account
 * @route   POST /api/users/logout
 * @access  PUBLIC
 */
router.post("/logout", lightLimiter, logoutUserAccount);
/**
 * @desc    Deactivate user account
 * @route   POST /api/users/deactivate
 * @access  PRIVATE
 */
router.post("/deactivate", lightLimiter, protect, deactivateUserAccount);

/**
 * @desc    Fetch user account details
 * @route   GET /api/users/me
 * @access  PRIVATE
 */
router.get("/me", lightLimiter, protect, fetchUserAccount);
/**
 * @desc    Change user account password
 * @route   PUT /api/users
 * @access  PRIVATE
 */
router.put("/", strictLimiter, protect, changeAccountPassword);

export default router;
