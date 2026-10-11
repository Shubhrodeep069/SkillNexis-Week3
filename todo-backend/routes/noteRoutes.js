
const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// CREATE a note
router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user.id
        });

        res.status(201).json({
            message: "Note created successfully!",
            note
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create note."
        });
    }
});

// READ all notes belonging to the logged-in user
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notes."
        });
    }
});

// READ one note
router.get("/:id", async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({
            message: "Invalid note ID."
        });
    }
});

// UPDATE a note
router.put("/:id", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (
            (title !== undefined && !title.trim()) ||
            (content !== undefined && !content.trim())
        ) {
            return res.status(400).json({
                message: "Title and content cannot be empty."
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        res.status(200).json({
            message: "Note updated successfully!",
            note
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update note."
        });
    }
});

// DELETE a note
router.delete("/:id", async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        res.status(200).json({
            message: "Note deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid note ID."
        });
    }
});

module.exports = router;