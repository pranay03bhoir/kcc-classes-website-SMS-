const mongoose = require("mongoose");
const Counter = require("./counterTeacher.model");
const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    alternateContact: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "teacher" },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: "" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    refreshToken: { type: String, default: "" },
    joiningYear: { type: Number, required: true },
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
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

teacherSchema.pre("save", async function (next) {
  if (!this.teacherId) {
    const year = this.joiningYear;
    const counter = await Counter.findOneAndUpdate(
      { name: `teacher-${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.teacherId = `Teacher-${year}-${String(counter.seq).padStart(4, "0")}`;
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
