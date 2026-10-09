import Usage from "../models/usage.model.js"


/**
 * @desc    The current calendar month in UTC as "YYYY-MM"
 */
export const currentMonth = () => new Date().toISOString().slice(0, 7);


/**
 * @desc    Adds one public request to a user's usage for the current month
 */
export const trackUserRequest = async (userId) => {
    if (!userId) return;

    try {
        await Usage.updateOne(
            { user_id: userId, month: currentMonth() },
            { $inc: { requests: 1 } },
            { upsert: true }
        );
    } catch (err) {
        console.error("There was an error tracking a user's monthly usage:", err);
    }
}
