const mongoose = require("mongoose");

const HistoryItemSchema = new mongoose.Schema({
  userId: { type: String, index: true }, // Add index on userId
  input: String,
  output: String,
  video: String,
});

const HistoryItem = mongoose.model("HistoryItem", HistoryItemSchema);

module.exports = HistoryItem;
