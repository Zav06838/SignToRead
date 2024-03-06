const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// Absolute paths to the videos directories
const videosDir =
  "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\transfer";
const lettersDir =
  "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\alphabets";

// Serve static files from the videos directory
router.use("/videos", express.static(videosDir));
router.use("/letters", express.static(lettersDir)); // Serve letters directory as well

// Check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

const preprocessVideo = async (videoPath) => {
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

router.post("/merge-words", async (req, res) => {
  const words = req.body.words;

  try {
    let videoProcessingPromises = [];

    // Process each word and map to corresponding videos
    words.forEach((word) => {
      const wordVideoPath = path.join(videosDir, `${word}.mp4`);
      if (fileExists(wordVideoPath)) {
        videoProcessingPromises.push(wordVideoPath);
      } else {
        console.log("Word not found: ", word);
        word
          .toLowerCase()
          .split("")
          .forEach((char) => {
            const charVideoPath = path.join(lettersDir, `${char}.mp4`);
            if (fileExists(charVideoPath)) {
              videoProcessingPromises.push(charVideoPath);
            }
          });
      }
    });

    // Preprocess videos if needed
    const processedVideoPaths = await Promise.all(
      videoProcessingPromises.map(preprocessVideo)
    );

    // Send video paths to frontend
    res.json({ videoSources: processedVideoPaths });
  } catch (error) {
    console.error("Error in video preprocessing: ", error);
    res.status(500).send("Error in processing videos");
  }
});

module.exports = router;
