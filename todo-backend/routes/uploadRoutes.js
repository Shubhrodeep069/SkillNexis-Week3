
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${extension}`;
    cb(null, uniqueName);
  },
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."));
    }
  },
});

// Upload one image
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 5 MB or smaller."
          : err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    res.status(201).json({
      message: "Image uploaded successfully!",
      image: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
      },
    });
  });
});

module.exports = router;
