const Batch = require("../models/Batch");

// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current active batch
exports.getCurrentBatch = async (req, res) => {
  try {
    const batch = await Batch.findOne({ completed: false });
    res.json(batch || null); // return null if no batch
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create batch
exports.createBatch = async (req, res) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update batch
exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete batch
exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Batch deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Complete batch
exports.completeBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
