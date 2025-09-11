const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const batchRoutes = require("./routes/batchRoutes");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/poultry", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

const dailyEntryRoutes = require("./routes/dailyEntryRoutes");
app.use("/api/daily-entries", dailyEntryRoutes);


// Routes
app.use("/api/batches", batchRoutes);

app.get("/", (req, res) => res.send("API running"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
