const mongoose = require("mongoose");

const topperSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    score: {
      type: String, // Assuming score is a string (e.g., "95%", "88/100")
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // URL or path to the image
      required: false,
      default: "", // Default to an empty string if no image is provided
    },
    year: {
      type: Number,
      required: true,
    },
    otherAchievements: [
      {
        type: String,
        required: false,
        default: "", // Default to an empty string if no achievements are provided
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Optionally, you can add a unique index if needed, e.g., on studentName, examType, and year
topperSchema.index({ studentName: 1, examType: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Topper", topperSchema);
