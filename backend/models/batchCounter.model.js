const mongoose = require("mongoose");

const CounterBatchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("CounterBatch", CounterBatchSchema);
module.exports = Counter;
