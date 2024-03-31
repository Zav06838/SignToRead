const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// AWS S3 bucket name
const bucketName = "psl-translation-video-bucket";
const videoDir = "transfer";

const getVideoContent = async (videoKey) => {
  const params = {
    Bucket: bucketName,
    Key: `${videoDir}/${videoKey}`,
  };
  const data = await s3.getObject(params).promise();
  return data.Body;
};

router.post("/process-words", async (req, res) => {
  const words = req.body.words;

  if (!words || words.length === 0) {
    return res.status(400).send("No words provided");
  }

  try {
    const videoPaths = [];

    // Fetch video streams for each word and write them to temporary files
    for (const word of words) {
      const videoKey = `${word}.mp4`; // Assuming video filenames are the same as words
      const videoStream = await getVideoContent(videoKey);
      const tempFilePath = path.join(__dirname, "..", "temp", `${word}.mp4`);
      fs.writeFileSync(tempFilePath, videoStream);
      videoPaths.push(tempFilePath);
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
      videoPaths.forEach((filePath) => {
        fs.unlinkSync(filePath);
      });
      fs.unlinkSync(listFilePath);
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
