import mongoose from "mongoose"

// public requests served for a user's counters, one document per user per calendar month (UTC)
const usageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // "YYYY-MM"
    month: {
        type: String,
        required: true,
    },
    requests: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
})

usageSchema.index({ user_id: 1, month: 1 }, { unique: true })

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
