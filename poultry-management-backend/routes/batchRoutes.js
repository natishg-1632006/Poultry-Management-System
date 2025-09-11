const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");
const multer = require("multer");
const path = require("path");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", batchController.getAllBatches);
router.get("/current", batchController.getCurrentBatch);
router.get("/:id", batchController.getBatchById);
router.post("/", upload.single("image"), batchController.createBatch);
router.put("/:id", upload.single("image"), batchController.updateBatch);
router.delete("/:id", batchController.deleteBatch);
router.put("/complete/:id", batchController.completeBatch);

module.exports = router;
