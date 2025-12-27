import crypto from "crypto";
import Counter from "../models/counter.model.js";

/**
 * @desc    Generate public_key for counters
 */

export const generatePublicApiKey = async () => {
  let key;
  let isUnique = false;
  const prefix = "notch_pub_";

  while (!isUnique) {
    // generate a random string for key
    const randomPart = crypto.randomBytes(24).toString("base64url");
    key = `${prefix}${randomPart}`;

    const existingCounter = await Counter.findOne({ public_key: key });
    if (!existingCounter) isUnique = true;
  }
  return key;
};
