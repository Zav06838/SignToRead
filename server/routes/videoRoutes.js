const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
// const fetch = require("node-fetch");
import("node-fetch").then((nodeFetch) => {
  const fetch = nodeFetch.default;

  // Your code that uses fetch
});

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// AWS S3 bucket name
const bucketName = "psl-translation-video-bucket";
const videoDir = "transfer";

// Function to sanitize file names
const sanitizeFileName = (name) => {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

const getVideoContent = async (videoKey) => {
  const params = {
    Bucket: bucketName,
    Key: videoKey,
  };
  const data = await s3.getObject(params).promise();
  return data.Body;
};

const fetchWordVideo = async (word) => {
  let videoKey;

  switch (word.toLowerCase()) {
    case "who":
    case "where":
    case "why":
    case "what":
    case "how":
      videoKey = `${videoDir}/${word.toLowerCase()}.mp4`;
      break;
    case "?":
      videoKey = `${videoDir}/question-mark.mp4`;
      break;
    default:
      videoKey = `${videoDir}/${word.replace(/[\[\]\(\),.+]+/g, "")}.mp4`;
      break;
  }

  try {
    const videoStream = await getVideoContent(videoKey);
    return videoStream;
  } catch (error) {
    console.error(`Video not found for word '${word}'`);
    const tempFilePath = path.join(
      __dirname,
      "..",
      "temp",
      `${sanitizeFileName(word)}.mp4`
    );
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    const synonyms = await findSynonymsFor(word);
    if (synonyms.length > 0) {
      for (const synonym of synonyms) {
        try {
          const synonymVideoStream = await getVideoContent(
            `${videoDir}/${sanitizeFileName(synonym)}.mp4`
          );
          console.log(`Using synonym '${synonym}' for word '${word}'`);
          return synonymVideoStream;
        } catch (error) {
          console.error(
            `Video not found for synonym '${synonym}' of word '${word}'`
          );
        }
      }
    } else {
      console.error(`No videos found for word '${word}'`);
      const image = await fetchImageFor(word);
      if (image) {
        return image;
      } else {
        console.error(`No image found for word '${word}'`);
        return null;
      }
    }
    return null;
  }
};

const findSynonymsFor = async (word) => {
  const apiKeyTh = process.env.THESAURUS_API_KEY;
  const url = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKeyTh}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const synonyms = data[0].meta.syns.flat();
      return synonyms.filter((synonym) => synonym !== word);
    } else {
      console.error(`No synonyms found for '${word}'`);
      return [];
    }
  } catch (error) {
    console.error(`Failed to fetch synonyms for '${word}': ${error}`);
    return [];
  }
};

const fetchImageFor = async (word) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?q=${word}&cx=${searchEngineId}&key=${apiKey}&searchType=image`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const imageUrl = data.items[0].link;
      const imageResponse = await fetch(imageUrl);
      return await imageResponse.buffer();
    } else {
      console.error(`No image found for '${word}'`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch image for '${word}': ${error}`);
    return null;
  }
};

router.post("/process-words", async (req, res) => {
  const words = req.body.words;

  if (!words || words.length === 0) {
    return res.status(400).send("No words provided");
  }

  try {
    const videoPaths = [];
    const videoStreams = [];

    let skipQuestionMark = false;

    for (let index = 0; index < words.length; index++) {
      const word = words[index];

      if (skipQuestionMark) {
        skipQuestionMark = false;
        continue; // Skip processing the word and move to the next iteration
      }

      let videoStream = await fetchWordVideo(word);

      if (!videoStream) {
        console.error(`Video not found for word '${word}'`);
        continue;
      }

      // Create the temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "..", "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempFilePath = path.join(tempDir, `${sanitizeFileName(word)}.mp4`);
      fs.writeFileSync(tempFilePath, videoStream);
      videoPaths.push(tempFilePath);
      videoStreams.push(videoStream);

      // Check if the word is one of the special words that skips the next word
      if (["who", "where", "why", "what", "how"].includes(word.toLowerCase())) {
        skipQuestionMark = true;
      }
    }

    // Write video paths to a text file
    const listFilePath = path.join(__dirname, "..", "temp", "video_list.txt");
    fs.writeFileSync(
      listFilePath,
      videoPaths
        .map((filePath) => `file '${filePath.replace(/\\/g, "/")}'`)
        .join("\n")
    );

    // Construct FFmpeg command to read from the text file
    const ffmpegCommand = [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFilePath,
      "-movflags",
      "frag_keyframe+empty_moov",
      "-c",
      "copy",
      "-f",
      "mp4",
      "pipe:1",
    ];

    // Spawn FFmpeg process
    const ffmpegProcess = spawn("ffmpeg", ffmpegCommand);

    let mergedVideo = Buffer.alloc(0);

    // Collect merged video data
    ffmpegProcess.stdout.on("data", (chunk) => {
      mergedVideo = Buffer.concat([mergedVideo, chunk]);
    });

    // Send merged video to the client when FFmpeg process finishes
    ffmpegProcess.on("close", (code) => {
      console.log("FFmpeg process exited with code:", code);
      // Delete temporary files
      deleteTempFiles(videoPaths, listFilePath);
      if (code === 0) {
        res.set({
          "Content-Type": "video/mp4",
          "Content-Length": mergedVideo.length,
        });
        res.end(mergedVideo);
      } else {
        res.status(500).send("FFmpeg process encountered an error");
      }
    });

    // Function to delete temporary files
    const deleteTempFiles = (videoPaths, listFilePath) => {
      const processedFiles = new Set();

      videoPaths.forEach((filePath) => {
        if (!processedFiles.has(filePath)) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          processedFiles.add(filePath);
        }
      });

      if (fs.existsSync(listFilePath)) {
        fs.unlinkSync(listFilePath);
      }
    };

    // Handle FFmpeg errors
    ffmpegProcess.stderr.on("data", (data) => {
      console.error("FFmpeg error output:", data.toString());
    });
  } catch (error) {
    console.error("Error streaming videos:", error);
    res.status(500).json({ error: "Error streaming videos" });
  }
});

module.exports = router;
