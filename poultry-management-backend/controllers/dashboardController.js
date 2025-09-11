const Batch = require("../models/Batch");
const DailyEntry = require("../models/DailyEntry");

const getDashboard = async (req, res) => {
  try {
    const batches = await Batch.find();
    const dailyEntries = await DailyEntry.find();

    const totalMortality = dailyEntries.reduce((sum, e) => sum + e.mortality, 0);
    const totalFeed = dailyEntries.reduce((sum, e) => sum + e.feedConsumption, 0);
    const totalWeightGain = dailyEntries.reduce((sum, e) => sum + e.avgWeight, 0);
    const currentBirdCount = batches.reduce((sum, b) => sum + b.totalChicks, 0) - totalMortality;
    const fcr = totalFeed / (totalWeightGain || 1);

    res.json({ dailyEntries, totalMortality, totalFeed, currentBirdCount, fcr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };
