const express = require("express");
const router = express.Router();
const History = require("../models/historyModel");

// Add a new history item
router.post("/", async (req, res) => {
  try {
    const { inputText, gloss, videoUrl } = req.body;
    const userId = req.user.id; // Assuming req.user.id contains the user's ID from Clerk
    const historyItem = new History({
      user: userId,
      inputText,
      gloss,
      videoUrl,
    });
    await historyItem.save();
    res.status(201).json(historyItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all history items for the current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id contains the user's ID from Clerk
    const history = await History.find({ user: userId });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
