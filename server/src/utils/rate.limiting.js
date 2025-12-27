import rateLimit from "express-rate-limit";

const defaultMessage = {
  message: "Too many requests. Please try again later.",
};

/**
 * @description strict limiter (login, create sccount, update password)
 * @purpose prevents brute force attacks and creation spam. high security risk
 */
export const strictLimiter = rateLimit({
  // 5 minutes
  windowMs: 5 * 60 * 1000,
  // limit each IP to 10 requests per 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many login/account creation attempts. Please try again in 5 minutes.",
  },
});

/**
 * @description light limiter (logout, fetch info, deactivate)
 * @purpose low to medium security risk. generous limit for normal user actions
 */
export const lightLimiter = rateLimit({
  // 15 minutes
  windowMs: 15 * 60 * 1000,
  // limit each IP to 100 requests per 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
});

/**
 * @description email check limiter (check availability)
 * @purpose prevents spamming of the API to check for existing email
 */
export const emailCheckLimiter = rateLimit({
  // 10 minutes
  windowMs: 10 * 60 * 1000,
  // Limit each IP to 60 checks per 10 minutes (1 check per 10 seconds average)
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many email availability checks. Please wait and try again.",
  },
});


/**
 * @description Increment limiter (public incrementing)
 * @purpose Prevents script-spamming a counter's count.
 */
export const incrementLimiter = rateLimit({
  // 10 seconds
  windowMs: 10 * 1000,
  // Limit each IP to 30 requests per 10 seconds
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too fast! Please slow down.",
  },
});

/**
 * @description Counter read limiter (public fetching)
 * @purpose Prevents aggressive scraping of counter data.
 */
export const counterReadLimiter = rateLimit({
  // 1 minute
  windowMs: 60 * 1000,
  // Limit each IP to 60 requests per minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests to view this counter. Please try again in a minute.",
  },
});
