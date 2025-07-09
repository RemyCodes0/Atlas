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

proofFiles: [
  {
    type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
  type: Date,
}
  }
],


  rejectionReason: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
