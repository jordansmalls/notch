import mongoose from "mongoose"


const globalStatsSchema = new mongoose.Schema({
    id: {
        type: String,
        default: "global_stats",
        unique: true,
    },
    total_clicks: {
        type: Number,
        default: 0,
    },
    total_user_count: {
        type: Number,
        default: 0,
    },
    total_counters_created: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
})


const GlobalStats = mongoose.model("GlobalStats", globalStatsSchema);
export default GlobalStats;