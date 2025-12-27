import mongoose from "mongoose"

const counterSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Counters must have a name."],
        minLength: [3, "Counters must have a length of at least 3 characters."],
        maxLength: [55, "Counter names must not exceed 55 characters."],
    },
    description: {
        type: String,
        default: "",
        maxLength: [255, "Counter descriptions must not exceed 255 characters."],
    },
    count: {
        type: Number,
        default: 0,
    },
    public_key: {
        type: String,
        required: [true, "A public_key is required."],
        unique: true,
    },
}, {
    timestamps: true,
})


// method to reset the count of a counter
counterSchema.methods.resetCount = async function() {
    this.count = 0
    return await this.save()
}

// method to increment the count by 1 and save
counterSchema.methods.incrementCount = async function() {
    this.count += 1
    return await this.save()
}


counterSchema.statics.incrementByPublicKey = function (publicKey) {
  return this.findOneAndUpdate(
    { public_key: publicKey },
    { $inc: { count: 1 } },
    { new: true }
  );
};

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;