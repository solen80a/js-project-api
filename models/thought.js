import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Thought = mongoose.model("Thought", thoughtSchema)