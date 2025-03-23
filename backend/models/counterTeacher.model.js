const mongoose = require("mongoose");

const counterTeacher = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});
const CounterTeacher = mongoose.model("CounterStudent");
module.exports = CounterTeacher;
