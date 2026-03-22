const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, minlength: 20, maxlength: 2000 },
    /** Denormalized at save so the public carousel does not depend on populate. */
    displayName: { type: String, default: "" },
    displayRole: { type: String, default: "" },
    displayImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
