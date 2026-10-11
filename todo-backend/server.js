
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const taskRoutes = require("./routes/taskRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/images", uploadRoutes);
app.use(
  "/uploads",
  express.static(require("path").join(__dirname, "uploads"))
);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Notes App Backend API is running!"
    });
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });