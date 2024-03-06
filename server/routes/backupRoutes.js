// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const os = require("os");
// const fs = require("fs");
// const { exec } = require("child_process");
// const { v4: uuidv4 } = require("uuid");

// // Absolute path to the videos directory
// const videosDir =
//   "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos";

// // Serve static files from the videos directory
// router.use("/videos", express.static(videosDir));

// // Streaming endpoint for individual videos
// router.get("/stream/:filename", (req, res) => {
//   const videoPath = path.join(videosDir, req.params.filename);
//   const stat = fs.statSync(videoPath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (range) {
//     const parts = range.replace(/bytes=/, "").split("-");
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunksize = end - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });
//     const head = {
//       "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": chunksize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       "Content-Length": fileSize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(videoPath).pipe(res);
//   }
// });

// // Endpoint to merge videos
// router.post("/merge-videos", (req, res) => {
//   const words = req.body.words;

//   if (!words || words.length === 0) {
//     return res.status(400).send("No words provided");
//   }

//   // Generate a temporary file to list videos
//   const fileList = `filelist-${uuidv4()}.txt`;
//   const fileListPath = path.join(os.tmpdir(), fileList);
//   const fileContent = words
//     .map((word) => `file '${path.join(videosDir, `${word}.mp4`)}'`)
//     .join("\n");

//   // Write the file list to the temporary file
//   fs.writeFileSync(fileListPath, fileContent);

//   // Unique filename for the output
//   const outputFilename = uuidv4() + ".mp4";
//   const outputPath = path.join(videosDir, outputFilename);

//   // ffmpeg command for merging
//   const command = `ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy "${outputPath}"`;

//   exec(command, (error) => {
//     // Delete the temporary file list
//     fs.unlinkSync(fileListPath);

//     if (error) {
//       console.error("Error merging videos:", error);
//       return res.status(500).send("Error merging videos");
//     }

//     res.json({ videoUrl: `/videos/${outputFilename}` });
//   });
// });

// module.exports = router;

////////////////////////////////////////////////////////////////

// !!Updated code!!

// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const { spawn } = require("child_process");
// const fs = require("fs");

// // Absolute path to the videos directory
// const videosDir =
//   "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos";

// // Serve static files from the videos directory
// router.use("/videos", express.static(videosDir));

// // Streaming endpoint for individual videos
// router.get("/stream/:filename", (req, res) => {
//   const videoPath = path.join(videosDir, req.params.filename);
//   const stat = fs.statSync(videoPath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (range) {
//     const parts = range.replace(/bytes=/, "").split("-");
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunksize = end - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });
//     const head = {
//       "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": chunksize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       "Content-Length": fileSize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(videoPath).pipe(res);
//   }
// });

// // Endpoint to stream merged videos
// router.post("/merge-videos", (req, res) => {
//   const words = req.body.words;

//   if (!words || words.length === 0) {
//     return res.status(400).send("No words provided");
//   }

//   // Handle single word: stream the video directly

//   // Handle single word: stream the video directly at 1.25x speed
//   if (words.length === 1) {
//     const videoPath = path.join(videosDir, `${words[0]}.mp4`);
//     res.setHeader("Content-Type", "video/mp4");

//     // Spawn ffmpeg process for single video speed change
//     const ffmpeg = spawn("ffmpeg", [
//       "-i",
//       videoPath,
//       "-filter_complex",
//       "[0:v]setpts=0.8*PTS[v];[0:a]atempo=1.25[a]",
//       "-map",
//       "[v]",
//       "-map",
//       "[a]",
//       "-f",
//       "matroska",
//       "-",
//     ]);

//     ffmpeg.stdout.pipe(res);
//     return;
//   }

//   // if (words.length === 1) {
//   //   const videoPath = path.join(videosDir, `${words[0]}.mp4`);
//   //   res.setHeader("Content-Type", "video/mp4");
//   //   fs.createReadStream(videoPath).pipe(res);
//   //   return;
//   // }

//   // Prepare the input for ffmpeg: a list of all video file paths
//   const inputs = words
//     .map((word) => path.join(videosDir, `${word}.mp4`))
//     .flatMap((file) => ["-i", file]);

//   // Set up ffmpeg arguments for merging
//   const ffmpegArgs = [
//     ...inputs,
//     "-filter_complex",
//     `concat=n=${words.length}:v=1:a=1[outv][outa]`,
//     "-map",
//     "[outv]",
//     "-map",
//     "[outa]",
//     "-f",
//     "matroska",
//     "-",
//   ];

//   // Spawn ffmpeg process
//   const ffmpeg = spawn("ffmpeg", ffmpegArgs);

//   // Set response headers
//   res.setHeader("Content-Type", "video/mp4");

//   // Pipe the output of ffmpeg directly to the response
//   ffmpeg.stdout.pipe(res);

//   // Handle ffmpeg errors
//   ffmpeg.on("error", (error) => {
//     console.error("ffmpeg error:", error);
//     res.status(500).send("Error processing videos");
//   });

//   ffmpeg.stderr.on("data", (data) => {
//     console.log("ffmpeg stderr:", data.toString());
//   });
// });

// module.exports = router;
