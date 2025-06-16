const mongoose = require("mongoose")

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a complaint title"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a complaint description"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: ["Garbage", "Potholes", "Drainage", "Streetlights", "Public Nuisance", "Water Supply", "Sewage", "Other"],
  },
  location: {
    type: String,
    required: [true, "Please provide location"],
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
  },
  image: {
    type: String, // File path for uploaded image
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
})

module.exports = mongoose.model("Complaint", complaintSchema)

