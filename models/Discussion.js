const mongoose = require("mongoose")

const discussionSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please provide a message"],
    maxlength: [500, "Message cannot exceed 500 characters"],
  },
  language: {
    type: String,
    enum: ["en", "hi", "mr", "ta", "bn", "gu", "te", "kn", "ml", "or"],
    default: "en",
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Discussion", discussionSchema)

