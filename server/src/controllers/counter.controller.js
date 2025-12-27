import Counter from "../models/counter.model.js";
import User from "../models/user.model.js"
import { generatePublicApiKey } from "../utils/generate.public.key.js"
import { trackGlobalClicks, trackGlobalCounters } from "../utils/global.utils.js";

// PRIVATE ROUTES

/**
 * @desc    Create counter
 * @route   POST /api/counters/
 * @access  PRIVATE
 */

export const createCounter = async (req, res) => {
    let { name, description } = req.body;

    try {

        const user = await User.exists({ _id: req.user._id });

        if(!user) {
            return res.status(404).json({ message: "User not found." })
        }

        if(!name) {
            return res.status(400).json({ message: "Invalid credentials (name missing). "})
        }

        if(description === null) {
            description = "";
        }

        let key = await generatePublicApiKey();

        const counter = await Counter.create({
            user_id: user._id,
            name,
            description,
            count: 0,
            public_key: key,
        })

        if(!counter) {
            return res.status(500).json({ message: "We ran into trouble creating your counter, please try again." })
        } else {
          // log new counter to global count
            trackGlobalCounters();
            return res.status(201).json({ counter: counter, message: "Counter created successfully." })
        }
    } catch (err) {
       console.error("There was an error creating a counter:", err);
       return res.status(500).json({ message: "We're having trouble, please try again soon." })
    }
}


/**
 * @desc    Reset counter
 * @route   POST /api/counters/:id/reset
 * @access  PRIVATE
 */
export const resetCounter = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (ID missing)." });
    }

    const counter = await Counter.findById(id);

    if (!counter) {
      return res.status(404).json({ message: "Counter not found." });
    }

    if (!counter.user_id.equals(req.user._id)) {
      return res.status(403).json({
        message: "You do not have permission to reset this counter.",
      });
    }

    await counter.resetCount();

    return res.status(200).json({
      message: "Counter reset successfully.",
      count: counter.count,
    });

  } catch (err) {
    console.error("There was an error resetting a counter:", err);
    return res
      .status(500)
      .json({ message: "We're having trouble, please try again." });
  }
};

/**
 * @desc    Delete counter
 * @route   DELETE /api/counters/:id
 * @access  PRIVATE
 */
export const deleteCounter = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid credentials (ID missing)." });
    }

    const counter = await Counter.findById(id);

    if (!counter) {
      return res.status(404).json({ message: "Counter not found." });
    }

    if (!counter.user_id.equals(req.user._id)) {
      return res.status(403).json({
        message: "You do not have permission to delete this counter.",
      });
    }

    await counter.deleteOne();
    return res.status(200).json({ message: "Counter deleted successfully." });

  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "We're having trouble deleting your counter, please try again later." });
  }
};


/**
 * @desc    Fetch all user counters
 * @route   GET /api/counters/
 * @access  PRIVATE
 */

export const fetchUserCounters = async (req, res) => {
    try {
        const user = await User.exists({ _id: req.user._id });

        if(!user) {
            return res.status(404).json({ message: "User not found." })
        }

        const counters = await Counter.find({ user_id: user._id }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({ counters: counters })

    } catch (err) {
        console.error("There was an error fetching a user's counters:", err)
        return res.status(500).json({ message: "Sorry we're having trouble processing your request, please try again soon." })
    }
}


/**
 * @desc    Update counter information
 * @route   PATCH /api/counters/
 * @access  PRIVATE
 */
export const updateCounter = async (req, res) => {
  const { id, name, description } = req.body;

  try {
    if (!id || !name || description === undefined) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials (counter ID, name, or description is missing)." });
    }

    const counter = await Counter.findById(id);

    if (!counter) {
      return res.status(404).json({ message: "Counter not found." });
    }

    if (counter.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have authorization to update this counter." });
    }

    counter.name = name;
    counter.description = description;

    const updatedCounter = await counter.save();

    return res.status(200).json({
      message: "Success! Counter updated.",
      counter: {
        user_id: updatedCounter.user_id,
        _id: updatedCounter._id,
        name: updatedCounter.name,
        description: updatedCounter.description,
        count: updatedCounter.count,
        createdAt: updatedCounter.createdAt,
      },
    });
  } catch (err) {
    console.error("There was an error attempting to update a counter:", err);
    return res
      .status(500)
      .json({ message: "We encountered trouble updating your counter, please try again later." });
  }
};


/**
 * @desc    Delete all user counters
 * @route   DELETE /api/counters/
 * @access  PRIVATE
 */

export const deleteAllUserCounters = async (req, res) => {
  const userId = req.user?._id;

  try {
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Not authorized, no user ID found." });
    }

    const result = await Counter.deleteMany({ user_id: userId });

    if (!result.acknowledged) {
      return res
        .status(500)
        .json({ message: "Database error: Deletion not acknowledged." });
    }

    return res.status(200).json({
      message: "All counters successfully deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("There was an error deleting all of a user's counters:", err);
    return res.status(500).json({
      message:
        "We're having trouble deleting your counters, please try again later.",
    });
  }
};


// PUBLIC ROUTES

/**
 * @desc    Read current count
 * @route   GET /api/counters/public/:public_key
 * @access  PUBLIC
 */
export const readCurrentCount = async (req, res) => {
    const { public_key } = req.params;

    try {
       if(!public_key) {
        return res.status(400).json({ message: "Invalid credentials (public_key missing)." });
       };

       const counter = await Counter.findOne({ public_key: public_key }).select("count");

       if(!counter) {
        return res.status(404).json({ message: "Counter not found", count: 0 })
       } else {
        return res.status(200).json({ count: counter.count })
       }
    } catch (err) {
        console.error("There was an error fetching the current count of a counter:", err);
        return res.status(500).json({ message: "There was an error, please try again.", count: 0 })
    }
}

/**
 * @desc    Increment count
 * @route   POST /api/counters/public/:public_key
 * @access  PUBLIC
 */

export const incrementCount = async (req, res) => {
    const { public_key } = req.params;

    try {

        if(!public_key) {
            return res.status(400).json({ message: "Invalid credentials (public_key missing)." })
        };

        const counter = await Counter.findOne({ public_key: public_key })

        if(!counter) {
            return res.status(404).json({ message: "Counter not found." })
        }

        const updatedCounter = await Counter.incrementByPublicKey(public_key);

        if(!updatedCounter) {
            return res.status(500).json({ message: "We're having trouble, please try again later." })
        } else {
            // update global count of clicks
            trackGlobalClicks();
            return res.status(200).json({ message: "Success", count: updatedCounter.count })
        }
    } catch (err) {
       console.error("There was an error incrementing a counter:", err);
       return res.status(500).json({ message: "We're having trouble, please try again." })
    }
}