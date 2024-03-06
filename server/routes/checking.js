const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function processCsv(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const videosDir =
    "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\transfer";
  const lettersDir =
    "C:\\Users\\Zaviar Khan\\OneDrive - Habib University\\PSL-Videos\\alphabets";

  const fileExists = (filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      return false;
    }
  };

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    if (lineNumber === 805) {
      break;
    }

    // console.log(`Line ${lineNumber}: Gloss: ${line}`);
    const words = line.split(" ");

    words.forEach((word) => {
      const wordVideoPath = path.join(videosDir, `${word}.mp4`);
      if (!fileExists(wordVideoPath)) {
        console.log(`Line ${lineNumber}: Word not found: ${word}`);
      }
    });
  }
}

// Replace 'path/to/your/file.csv' with the path to your CSV file
processCsv("C:\\Users\\Zaviar Khan\\Downloads\\gloss.csv").catch(console.error);
