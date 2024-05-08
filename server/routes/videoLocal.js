const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// Absolute paths to the videos directories
// const videosDir =
//   "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\transfer";
const videosDir =
  "C:\\Users\\Zaviar Khan\\Desktop\\WEB DEV\\SignToRead\\server\\videos";

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
    "scale=854:480", // scale to 1280x720 resolution
    "-r",
    "30", // set frame rate to 30 fps
    "-c:v",
    "libx264", // set video codec to libx264
    "-preset",
    "ultrafast", // use the ultrafast preset for faster encoding // set video codec to libx264
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

router.post("/merge-videos", (req, res) => {
  const words = req.body.words;
  console.log(words);

  if (!words || words.length === 0) {
    return res.status(400).send("No words provided");
  }

  let videoProcessingPromises = [];
  let skipQuestionMark = false;

  let signal = 0;
  words.forEach((word, index) => {
    if (skipQuestionMark) {
      skipQuestionMark = false;
      return; // Skip processing the word and move to the next iteration
    }

    if (word == "(1)") {
      signal = 1;
      return;
    }

    if (signal == 0) {
      if (["who", "where", "why", "what", "how"].includes(word.toLowerCase())) {
        word = word.toLowerCase();
        skipQuestionMark = true; // Set the flag to skip the next word
      } else if (word == "?") {
        word = "question-mark";
      }
      let r;
      r = word.replace(/[\[\],.+]+/g, "");
      const wordVideoPath = path.join(videosDir, `${r}.mp4`);

      if (fileExists(wordVideoPath)) {
        videoProcessingPromises.push(preprocessVideo(wordVideoPath));
      } else if (fileExists(word)) {
        videoProcessingPromises.push(path.join(videosDir, `${word}.mp4`));
      } else {
        console.log("Word not found: ", word);
        console.log(index);

        if (index < words.length - 1) {
          let current = "";
          current =
            word +
            "-" +
            words[index + 1].toLowerCase().replace(/[\[\],.+]+/g, "");
          // let cleaned = word.replace(/[\[\]\(\),.+]+/g, "");
          const wordVideoPath = path.join(videosDir, `${current}.mp4`);
          console.log(wordVideoPath);
          if (fileExists(wordVideoPath)) {
            signal = 1;
            videoProcessingPromises.push(preprocessVideo(wordVideoPath));
          } else {
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
        } else {
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
      }
    } else {
      signal = 0;
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
