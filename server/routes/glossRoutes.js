// glossRoutes.js
const express = require("express");
const Gloss = require("../models/glossModel"); // Import the model
const router = express.Router();

router.post("/", async (req, res) => {
  const { englishText } = req.body;
  const glossData = await Gloss.findOne({ englishText: englishText });

  if (glossData) {
    res.json({ pslGloss: glossData.pslGloss });
  } else {
    res.json({
      pslGloss: "Default gloss or random gloss if sentence not found",
    });
  }
});

module.exports = router;
