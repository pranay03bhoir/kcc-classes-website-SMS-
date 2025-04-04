const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examType: {
      type: String,
      enum: [
        "Midterm",
        "Final",
        "Quiz",
        "Assignment",
        "Board",
        "JEE",
        "NEET",
        "JEE Mains",
        "JEE Advanced",
        "MH CET",
        "NEET UG",
        "NEET UA",
        "NEET PG",
      ],
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
