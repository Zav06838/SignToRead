const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const axios = require("axios");

// Replace with the appropriate model and token information
const modelId = "najju/LLama2-sign-to-read-psl";
const hfToken = "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";

// Absolute paths to the videos directories
const videosDir =
  "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\transfer";
const lettersDir =
  "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\alphabets";

// Serve static files from the videos directory
router.use("/videos", express.static(videosDir));

// Check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

const preprocessVideo = (videoPath) => {
  const outputVideoPath = videoPath.replace(".mp4", "_processed.mp4");
  const ffmpegProcess = spawn("ffmpeg", [
    "-i",
    videoPath,
    "-vf",
    "scale=1280:720", // scale to 1280x720 resolution
    "-r",
    "30", // set frame rate to 30 fps
    "-c:v",
    "libx264", // set video codec to libx264
    "-c:a",
    "aac", // set audio codec to AAC
    "-strict",
    "-2", // for AAC audio compatibility
    "-y",
    outputVideoPath, // output file path
  ]);

  return new Promise((resolve, reject) => {
    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve(outputVideoPath);
      } else {
        reject(`FFmpeg exited with code ${code}`);
      }
    });
  });
};

const generateGloss = async (text) => {
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${modelId}`,
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

router.post("/process-gloss", async (req, res) => {
  try {
    const generatedGloss = req.body.generatedGloss;

    // Process the generated gloss using the Sign to Read model
    const processedGloss = await generateGloss(generatedGloss);

    // Return the processed gloss
    return res.status(200).json({ processedGloss });
  } catch (error) {
    console.error("Error processing gloss:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/merge-videos", async (req, res) => {
  const words = req.body.words;

  if (!words || words.length === 0) {
    return res.status(400).send("No words provided");
  }

  let videoProcessingPromises = [];

  words.forEach((word) => {
    const wordVideoPath = path.join(videosDir, `${word}.mp4`);
    if (fileExists(wordVideoPath)) {
      videoProcessingPromises.push(preprocessVideo(wordVideoPath));
    } else {
      console.log("Word not found: ", word);
      word
        .toLowerCase()
        .split("")
        .forEach((char) => {
          const charVideoPath = path.join(lettersDir, `${char}.mp4`);
          if (fileExists(charVideoPath)) {
            videoProcessingPromises.push(preprocessVideo(charVideoPath));
          }
        });
    }
  });

  Promise.all(videoProcessingPromises)
    .then((processedVideoFiles) => {
      // ffmpeg inputs for the collected and processed video files
      const inputs = processedVideoFiles.flatMap((file) => ["-i", file]);
      // Set up ffmpeg arguments for merging
      const ffmpegArgs = [
        ...inputs,
        "-filter_complex",
        `concat=n=${processedVideoFiles.length}:v=1:a=1[outv][outa];[outv]setpts=0.8*PTS[vout];[outa]atempo=1.25[aout]`,
        "-map",
        "[vout]",
        "-map",
        "[aout]",
        "-f",
        "matroska",
        "-",
      ];

      // Spawn ffmpeg process
      const ffmpeg = spawn("ffmpeg", ffmpegArgs);

      res.setHeader("Content-Type", "video/mp4");
      ffmpeg.stdout.pipe(res);

      ffmpeg.stderr.on("data", (data) => {
        console.error("ffmpeg stderr:", data.toString());
      });
    })
    .catch((error) => {
      console.error("Error in video preprocessing: ", error);
      return res.status(500).send("Error in processing videos");
    });
});

module.exports = router;
