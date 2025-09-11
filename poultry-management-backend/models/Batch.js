const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalChicks: { type: Number, required: true },
  startDate: { type: Date, required: true },
  initialWeight: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  totalWeight: { type: Number },
  currentChicks: { type: Number },
  feedback: { type: String },
});

module.exports = mongoose.model("Batch", batchSchema);
