
const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// CREATE a task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      user: req.user.id,
    });

    res.status(201).json({
      message: "Task created successfully!",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({
      message: "Failed to create task.",
    });
  }
});

// READ all tasks belonging to the logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error.message);
    res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
});

// UPDATE a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty.",
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Description must be text.",
        });
      }
      updates.description = description.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false.",
        });
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update.",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task updated successfully!",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(400).json({
      message: "Failed to update task. Check the task ID.",
    });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(400).json({
      message: "Invalid task ID.",
    });
  }
});

module.exports = router;
