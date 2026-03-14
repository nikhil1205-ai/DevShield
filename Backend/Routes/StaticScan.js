import express from "express";
import path from "path";
import fs from "fs";

import { explainWithGemini } from "../utils/gemini_Static_code.js";
import { walkFiles } from "../utils/fileWalker.js";
import { readFileSafe } from "../utils/readFileSafe.js";

const router = express.Router();
router.get("/:scanId", async (req, res) => {
  const { scanId } = req.params;

  const scanFolder = path.join(
    process.cwd(),
    "tmp",
    "projects",
    `scan_${scanId}`
  );

  if (!fs.existsSync(scanFolder)) {
    return res.status(404).json({ error: "Scan folder not found" });
  }

  const ans = {};
  const files = walkFiles(scanFolder);

  for (const filePath of files) {
    const code = readFileSafe(filePath);
    if (!code) continue;

    // 🔐 Limit code size to protect tokens
    const limitedCode = code.split("\n").slice(0, 300).join("\n");

    /**
     * 🔥 Gemini now detects MULTIPLE vulnerable sections
     * explainWithGemini must return an ARRAY of sections
     */
    const aiSections = await explainWithGemini(limitedCode, filePath);

    if (!aiSections || !aiSections.length) continue;

    ans[filePath] = aiSections.map(sec => [
      sec.section,
      sec.fix,
      sec.why
    ]);
  }

  res.json({ scanId, ans });
});

export default router;
