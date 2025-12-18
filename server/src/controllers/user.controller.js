import User from "../models/user.model.js";
import generateToken from "../utils/generate.jwt.js";

/**
 * @desc    Create user account
 * @route   POST /api/users/
 * @access  PUBLIC
 */

export const createUserAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    let emailTaken = await User.findOne({ email });

    if (emailTaken) {
      return res
        .status(409)
        .json({ message: "Email is already associated with an account." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Passwords must be at least 8 characters." });
    }

    const user = await User.create({
      email,
      password,
    });

    if (!user) {
      return res.status(500).json({
        message:
          "We're having trouble creating your account, please try again.",
      });
    } else {
      // login user with JWT on successful account creation
      generateToken(res, user._id);
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
  } catch (err) {
    console.error("There was an error creating a user account:", err);
    return res
      .status(500)
      .json({ message: "We're having trouble, please try again soon." });
  }
};

/**
 * @desc    Check if an email is taken
 * @route   GET /api/users/check-email/:email
 * @access  PUBLIC
 */

export const checkEmailAvailability = async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (email missing)." });
    }

    const isTaken = await User.findOne({ email });

    if (isTaken) {
      return res.status({ message: "Email is already in use.", taken: true });
    } else {
      return res.status({ message: "Email available!", taken: false });
    }
  } catch (err) {
    console.error(
      "There was an error checking the availability of an email:",
      err
    );
    return res
      .status(500)
      .json({ message: "We're having trouble, try again." });
  }
};

/**
 * @desc    Login user account
 * @route   POST /api/users/login
 * @access  PUBLIC
 */

export const loginUserAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "An account with the given email does not yet exist, sign up?",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      if (user.active === false) {
        user.active = true;
        // Reactivate the account in the database
        await user.save();
        console.log(`User ${user.email} reactivated.`);
      }

      // log in user
      generateToken(res, user._id);

      return res.status(200).json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        message: "Account reactivated, login successful.",
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (err) {
    console.error("There was an error logging a user in:", err);
    return res.status(500).json({
      message: "We're having trouble logging you in, please try again.",
    });
  }
};

/**
 * @desc    Logout user account
 * @route   POST /api/users/logout
 * @access  PUBLIC
 */

export const logoutUserAccount = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res
      .status(200)
      .json({ message: "Logged out successfully. Please come back." });
  } catch (err) {
    console.error("There was an error attempting to log out a user:", err);
    return res.status(500).json({
      message: "We're having trouble logging you out, please try again.",
    });
  }
};

/**
 * @desc    Deactivate user account
 * @route   POST /api/users/deactivate
 * @access  PRIVATE
 */

export const deactivateUserAccount = async (req, res) => {
  const id = req.user?._id;

  try {
    if (!id) {
      return res
        .status(401)
        .json({ message: "Invalid credentials (ID missing)." });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, active: true },
      { $set: { active: false } },
      { new: true }
    );

    if (!user) {
      // If no user was found with that ID AND active:true,
      // it's either a non-existent user or already inactive.
      const checkUser = await User.findById(id);
      if (!checkUser) {
        return res.status(404).json({ message: "User not found." });
      }
      return res.status(400).json({ message: "Account is already inactive." });
    }

    // Clear the cookie on the server side
    res.clearCookie("jwt");

    return res
      .status(200)
      .json({ message: "Account successfully deactivated." });
  } catch (err) {
    console.error("There was an error deactivating a user account:", err);
    return res
      .status(500)
      .json({
        message:
          "We're having trouble deactivating your account, please try again.",
      });
  }
};

/**
 * @desc    Fetch user account details
 * @route   GET /api/users/me
 * @access  PRIVATE
 */

export const fetchUserAccount = async (req, res) => {
  const id = req.user._id;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (ID missing)." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    } else {
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
  } catch (err) {
    console.error(
      "There was an error fetching a user's account information:",
      err
    );
    return res
      .status(500)
      .json({
        message:
          "We're having trouble fetching your account, please try again later.",
      });
  }
};

/**
 * @desc    Change user account password
 * @route   PUT /api/users
 * @access  PRIVATE
 */

export const changeAccountPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const id = req.user._id;

  try {
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // find user by their authenticated ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if current password is correct
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // update user password - hashed by pre save method DB
    user.password = newPassword;
    const success = await user.save();

    if (success) {
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    } else {
      console.error(
        "There was a DB error while attempting to update a user's password."
      );
      return res
        .status(500)
        .json({ message: "We're having trouble, please try again." });
    }
  } catch (err) {
    console.error(
      "There was an error attempting to update a user's password:",
      err
    );
    return res.status(500).json({
      message: "We're having trouble updating your password, please try again.",
    });
  }
};
