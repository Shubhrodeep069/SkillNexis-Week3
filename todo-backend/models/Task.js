
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      maxlength: [150, "Task title cannot exceed 150 characters."],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters."],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
