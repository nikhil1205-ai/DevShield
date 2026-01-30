import express from "express";
import path from "path";
import fs from "fs";

import { explainWithGemini } from "../utils/geminiExplain.js";
import { walkFiles } from "../utils/fileWalker.js";
import { readFileSafe } from "../utils/readFileSafe.js";

const router = express.Router();

router.get("/:scanId", async (req, res) => {
  const { scanId } = req.params;

  const scanFolderPath = path.join(
    process.cwd(),
    "tmp",
    "nik",
    `scan_${scanId}`
  );

  // ❌ Scan folder not found
  if (!fs.existsSync(scanFolderPath)) {
    return res.status(404).json({
      error: "Scan folder not found"
    });
  }

  try {
    const files = walkFiles(scanFolderPath);

    const ans = {};

    for (const filePath of files) {
      const code = readFileSafe(filePath);
      if (!code) continue;

      // 🔐 Limit code size sent to Gemini
      const limitedCode = code.split("\n").slice(0, 120).join("\n");

      const aiResult = await explainWithGemini(limitedCode, filePath);

      ans[filePath] = [
        aiResult.vulnerable,
        aiResult.secure,
        aiResult.why
      ];
    }

    return res.json({
      scanId,
      ans
    });

  } catch (err) {
    console.error("Static scan failed:", err);
    return res.status(500).json({
      error: "Static scan failed"
    });
  }
});

export default router;
