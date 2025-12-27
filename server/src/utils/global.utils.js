import GlobalStats from "../models/global.model.js"


/**
 * @desc    Increments global clicks. If a user deletes their counters, the number of clicks tracked across the application remains the same
 */

export const trackGlobalClicks = async () => {
    try {
        await GlobalStats.updateOne(
          { id: "global_stats" },
          { $inc: { total_clicks: 1 } },
          { upsert: true }
        );

    } catch (err) {
       console.error("There was an error adding a click to the global count:", err);
    }
}


/**
 * @desc    Logs a new user to the global count.
 */

export const trackNewUser = async () => {
    try {
        await GlobalStats.updateOne(
          { id: "global_stats" },
          { $inc: { total_user_count: 1 } },
          { upsert: true }
        );
    } catch (err) {
        console.error("There was an error adding a user to the global count:", err);
    }
};


/**
 * @desc    Increments total count of counters created amongst notch (maintains count whether or not counter has been deleted)
 */

export const trackGlobalCounters = async () => {
    try {
        await GlobalStats.updateOne(
            { id: "global_stats" },
            { $inc: { total_counters_created: 1 } },
            { upsert: true }
        )
    } catch (err) {
       console.error("There was an error adding a counter to the global count:", err);
    }
}