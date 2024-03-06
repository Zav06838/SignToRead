// // glossRoutes.js
// const express = require("express");
// const Gloss = require("../models/glossModel"); // Import the model
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { englishText } = req.body;
//   const glossData = await Gloss.findOne({ englishText: englishText });

//   if (glossData) {
//     res.json({ pslGloss: glossData.pslGloss });
//   } else {
//     res.json({
//       pslGloss: "No gloss found for this English text.",
//     });
//   }
// });

// module.exports = router;
// glossRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Replace with the appropriate model and token information
const modelId = "najju/LLama2-sign-to-read-psl";
const hfToken = "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";

router.post("/", async (req, res) => {
  try {
    const { englishText } = req.body;

    // Call the Sign to Read model API to generate gloss
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${modelId}`,
      { inputs: englishText },
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedGloss = response.data;

    res.json({ pslGloss: generatedGloss });
  } catch (error) {
    console.error("Error generating gloss:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
