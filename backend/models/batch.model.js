const mongoose = require("mongoose");
const Counter = require("./batchCounter.model");
const batchSchema = new mongoose.Schema({
  batchId: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  classStd: { type: String, required: true },
  timings: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

batchSchema.pre("save", async function (next) {
  if (!this.batchId) {
    const timing = this.timings;
    const std = this.classStd;
    const counter = await Counter.findOneAndUpdate(
      { name: `Batch-${std}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.batchId = `BTH-${std}-${timing}-${String(counter.seq).padStart(4, "0")}`;
  }
});

module.exports = mongoose.model("Batch", batchSchema);
