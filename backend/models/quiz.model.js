const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      type: {
        type: String,
        enum: ["MCQ", "TrueFalse", "ShortAnswer"],
        required: true,
      },
      options: [{ type: String }], // For MCQs only
      correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
