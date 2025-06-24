const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  assignedTo: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "in progress", "completed", "rejected"],
    default: "pending",
  },
    dueDate: {
    type: Date,
    required: true,
  },

  proofFiles: {
    text: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
  },

  rejectionReason: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
