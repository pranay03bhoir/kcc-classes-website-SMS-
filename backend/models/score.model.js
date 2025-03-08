const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    examType: {
      type: String,
      enum: ["Midterm", "Final", "Quiz", "Assignment"],
      required: true,
    },
    score: { type: Number, required: true, min: 0, max: 100 },
    date: { type: Date, default: Date.now },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Score", scoreSchema);
