const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    parentsContact: [{ type: String, required: true }],
    address: { type: String, required: true },
    currentStd: { type: String, default: "", required: true },
    role: { type: String, default: "student" },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: "" }, // Stored in AWS S3
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    scores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Score",
      },
    ],
    refreshToken: { type: String, default: "" },
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
module.exports = mongoose.model("Student", studentSchema);
