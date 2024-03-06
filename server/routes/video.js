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
    "scale=1280:720",
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-strict",
    "-2",
    "-y",
    outputVideoPath,
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
  const englishSentence = req.body.sentence;

  if (!englishSentence) {
    return res.status(400).send("No sentence provided");
  }

  // Convert the sentence to gloss
  const glosses = convertToGloss(englishSentence).split(" ");

  let videoProcessingPromises = [];

  glosses.forEach((gloss) => {
    const glossVideoPath = path.join(videosDir, `${gloss}.mp4`);
    if (fileExists(glossVideoPath)) {
      videoProcessingPromises.push(preprocessVideo(glossVideoPath));
    } else {
      gloss
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

function convertToGloss(englishSentence) {
  // Split the sentence into words and handle lowercasing
  const words = englishSentence.toLowerCase().split(/\s+/);

  // Define a list of common temporal words (this list can be expanded)
  const temporalWordList = [
    "yesterday",
    "today",
    "tomorrow",
    "daily",
    "now",
    "then",
  ];

  // Simplify the sentence by removing less crucial elements
  const contentWords = words.filter(
    (word) =>
      ![
        "the",
        "a",
        "an",
        "is",
        "are",
        "am",
        "of",
        "and",
        "in",
        "on",
        "to",
        "do",
        "does",
        "did",
      ].includes(word)
  );

  // Handle temporal markers and verb simplification
  const temporalMarkers = [];
  const simplifiedWords = contentWords
    .map((word) => {
      if (temporalWordList.includes(word)) {
        temporalMarkers.push(word);
        return ""; // Remove the temporal word from its original position
      } else if (word.match(/(ed|ing|s)$/)) {
        // rudimentary verb identification
        // Simplify verbs to their base form
        return word.replace(/(ed|ing|s)$/, ""); // rudimentary verb simplification
      } else {
        return word;
      }
    })
    .filter((word) => word); // Remove empty strings

  // Reordering for SOV structure and handling spatial references
  const reordered = []; // Start with an empty array
  let verbIndex = -1;
  simplifiedWords.forEach((word, index) => {
    if (word.match(/(ed|ing|s)$/)) {
      // rudimentary verb identification
      verbIndex = index; // Find the verb index for later use
    } else {
      reordered.push(word); // Push subjects and objects
    }
  });

  // Place the verb at the end for SOV order
  if (verbIndex !== -1) {
    reordered.push(simplifiedWords[verbIndex]);
  }

  // Handle negation, modality, lexical variations, and cultural references
  const finalGloss = reordered.map((word) => {
    // Apply specific rules for negation, modality, lexical variations, etc.
    if (word === "not") {
      return "negation";
    } else {
      return word; // Example placeholder for lexical variations and cultural references
    }
  });

  // Combine temporal markers at the beginning and the reordered sentence
  return [...temporalMarkers, ...finalGloss].join(" ");
}

// Example usage
console.log(
  convertToGloss("The cat chases the mouse in the house every morning.")
);

module.exports = router;
