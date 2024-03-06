const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const thesaurus = require("powerthesaurus-api");
const { Worker } = require("worker_threads");

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
    "scale=854:480", // scale down to 480p resolution
    "-r",
    "30", // set frame rate to 30 fps
    "-c:v",
    "libx264", // set video codec to libx264
    "-preset",
    "ultrafast", // use the ultrafast preset for faster encoding
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



router.post("/merge-videos", async (req, res) => {
  const { words } = req.body;
  if (!words || words.length === 0) {
    return res.status(400).send("No words provided");
  }

  let videoProcessingPromises = [];

  for (const word of words) {
    let videoPath = path.join(videosDir, `${word}.mp4`);
    if (fileExists(videoPath)) {
      videoProcessingPromises.push(preprocessVideo(videoPath));
    } else {
      // Search for synonyms if the video does not exist
      try {
        const synonyms = await findSynonyms(word);
        let found = false;

        for (const synonym of synonyms) {
          videoPath = path.join(videosDir, `${synonym}.mp4`);
          if (fileExists(videoPath)) {
            videoProcessingPromises.push(preprocessVideo(videoPath));
            found = true;
            break; // Use the first found synonym
          }
        }

        if (!found) {
          console.log(`No video or synonym found for: ${word}`);
          // Optionally handle individual characters if no synonyms with videos are found
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
      } catch (error) {
        console.error(`Error fetching synonyms for ${word}: `, error);
      }
    }
  }

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
