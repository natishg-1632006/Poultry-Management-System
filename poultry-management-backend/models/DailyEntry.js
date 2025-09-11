const mongoose = require("mongoose");

const dailyEntrySchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  date: { type: Date, required: true },
  feedPacks: { type: Number, required: true },
  dead: { type: Number, required: true },
  weight: { type: Number, required: true },
  feedType: { type: String, enum: ["Starter", "Grower", "Finisher"], default: "Starter" },
});

module.exports = mongoose.model("DailyEntry", dailyEntrySchema);
