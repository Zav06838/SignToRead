const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store Clerk user ID
  inputText: { type: String, required: true },
  gloss: { type: String, required: true },
  videoUrl: { type: String },
});

module.exports = mongoose.model("History", historySchema);
