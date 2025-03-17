const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: Number, required: true },
    alternateContact: { type: Number, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "teacher" },
    profileImage: { type: String, default: "" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
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
module.exports = mongoose.model("Teacher", teacherSchema);
