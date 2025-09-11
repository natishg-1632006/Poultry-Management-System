const DailyEntry = require("../models/DailyEntry");

// Get all entries
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await DailyEntry.find().populate("batch");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get entries by batch ID
exports.getEntriesByBatch = async (req, res) => {
  try {
    const entries = await DailyEntry.find({ batch: req.params.id });
    if (!entries || entries.length === 0)
      return res.status(404).json({ message: "No entries found for this batch" });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const { batch, date, feedPacks, dead, weight, feedType } = req.body;
    if (!batch || !date || feedPacks == null || dead == null || weight == null || !feedType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const entry = new DailyEntry({ batch, date, feedPacks, dead, weight, feedType });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update entry
exports.updateEntry = async (req, res) => {
  try {
    const updated = await DailyEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const deleted = await DailyEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
