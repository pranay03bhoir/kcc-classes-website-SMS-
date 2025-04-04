const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Middle School", "High School", "Science", "Commerce"],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    classesPerWeek: {
      type: Number,
      required: true,
    },
    gradeLevel: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: "default-course-image.png", // Store images in S3 or Cloudinary
    },
    code: { type: String, required: true, unique: true, index: true },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
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
module.exports = mongoose.model("Subject", subjectSchema);
