import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password required."],
    minLength: [8, "Password should be at least 8 characters."],
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

// index for better query performance
userSchema.index({ email: 1 });

// compare password hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// method to activate user
userSchema.methods.activate = function () {
  this.active = true;
  return this.save();
};

// method to deactivate user
userSchema.methods.deactivate = function () {
  this.active = false;
  return this.save();
};

// method to check if user is active
userSchema.methods.isActive = function () {
  return this.active;
};

const User = mongoose.model("User", userSchema);
export default User;
