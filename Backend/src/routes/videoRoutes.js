import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(cors());

// Sanitize filename to prevent path traversal (e.g. ../../../etc/passwd)
const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "");

// Video streaming route
router.get("/:filename", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  const safeFilename = sanitizeFilename(req.params.filename);
  if (!safeFilename) return res.status(400).send("Invalid filename");
  const videoPath = path.join(__dirname, "..", "uploads", safeFilename);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 1 * 1e6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4", // adjust if needed
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

export default router;
