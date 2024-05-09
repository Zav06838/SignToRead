const express = require("express");
const HistoryItem = require("../models/HistoryItem");

const router = express.Router();

// Add history item for the current user
router.post("/addHistoryItem", async (req, res) => {
  const { input, output, video } = req.body;
  const userId = req.user.id; // Get user ID from authenticated user

  try {
    const historyItem = new HistoryItem({ userId, input, output, video });
    await historyItem.save();
    res.status(201).send("History item added successfully");
  } catch (error) {
    res.status(500).send("Failed to add history item");
  }
});

// Get user-specific history items
router.get("/history", async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated user

  try {
    const historyItems = await HistoryItem.find({ userId });
    res.status(200).json(historyItems);
  } catch (error) {
    res.status(500).send("Failed to fetch history items");
  }
});

module.exports = router;
