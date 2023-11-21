// glossModel.js
const mongoose = require("mongoose");

const GlossSchema = new mongoose.Schema({
  englishText: {
    type: String,
    required: true,
  },
  pslGloss: {
    type: String,
    required: true,
  },
});

const Gloss = mongoose.model("Gloss", GlossSchema);

module.exports = Gloss;
