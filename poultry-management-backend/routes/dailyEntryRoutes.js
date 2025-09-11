const express = require("express");
const router = express.Router();
const dailyEntryController = require("../controllers/dailyEntryController");

router.get("/", dailyEntryController.getAllEntries);
router.get("/batch/:id", dailyEntryController.getEntriesByBatch);
router.post("/", dailyEntryController.createEntry);
router.put("/:id", dailyEntryController.updateEntry);
router.delete("/:id", dailyEntryController.deleteEntry);

module.exports = router;
