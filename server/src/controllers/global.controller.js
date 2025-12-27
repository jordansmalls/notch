import GlobalStats from "../models/global.model.js"

/**
 * @desc    Fetch All Global Statistics
 * @route   GET /api/global
 * @access  PUBLIC
 */
export const fetchGlobalStatistics = async (req, res) => {
  try {
    const stats = await GlobalStats.findOne({ id: "global_stats" });

    if (!stats) {
      return res.status(200).json({
        total_clicks: 0,
        total_user_count: 0,
        total_counters_created: 0,
      });
    }
    return res.status(200).json(stats);
  } catch (err) {
    console.error(
      "There was an error fetching the global statistics for notch:",
      err
    );
    return res.status(500).json({
      message: "We're having trouble, please try again later.",
    });
  }
};

/**
 * @desc    Fetch Global Clicks
 * @route   GET /api/global/clicks
 * @access  PUBLIC
 */

export const fetchGlobalClicks = async (req, res) => {
  try {

    const global_stats = await GlobalStats.findOne({ id: "global_stats" })

    if(!global_stats) {
      console.error("An error occurred trying to fetch global stats, it likely does not exist.");
    } else {
      return res.status(200).json({ global_clicks: global_stats.total_clicks });
    }

  } catch (err) {
    console.error("There was an error fetching global counters:", err);
    return res.status(500).json({ message: "There was an issue fetching global clicks, please try again later." })
  }
}

/**
 * @desc    Fetch Global Users
 * @route   GET /api/global/users
 * @access  PUBLIC
 */

export const fetchGlobalUsers = async (req, res) => {
  try {
    const global_stats = await GlobalStats.findOne({ id: "global_stats" });

    if (!global_stats) {
      console.error(
        "An error occurred trying to fetch global users, it likely does not exist."
      );
    } else {
      return res.status(200).json({ global_users: global_stats.total_user_count });
    }
  } catch (err) {
    console.error("There was an error fetching global users:", err);
    return res
      .status(500)
      .json({
        message:
          "There was an issue fetching global users, please try again later.",
      });
  }
};

/**
 * @desc    Fetch Global Counters
 * @route   GET /api/global/counters
 * @access  PUBLIC
 */

export const fetchGlobalCounters = async (req, res) => {
  try {
    const global_stats = await GlobalStats.findOne({ id: "global_stats" });

    if (!global_stats) {
      console.error(
        "An error occurred trying to fetch global counters, it likely does not exist."
      );
    } else {
      return res
        .status(200)
        .json({ global_counters: global_stats.total_counters_created });
    }
  } catch (err) {
    console.error("There was an error fetching global counters:", err);
    return res.status(500).json({
      message:
        "There was an issue fetching global counters, please try again later.",
    });
  }
};
