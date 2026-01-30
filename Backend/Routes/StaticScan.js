// import express from "express";
// import path from "path";
// import fs from "fs";

// import { explainWithGemini } from "../utils/geminiExplain.js";
// import { walkFiles } from "../utils/fileWalker.js";
// import { readFileSafe } from "../utils/readFileSafe.js";
// import { detectVulnerableLines } from "../utils/ruleDetector.js";


// const router = express.Router();

// router.get("/:scanId", async (req, res) => {
//   const { scanId } = req.params;

//   const scanFolderPath = path.join(
//     process.cwd(),
//     "tmp",
//     "nik",
//     `scan_${scanId}`
//   );

//   // ❌ Scan folder not found
//   if (!fs.existsSync(scanFolderPath)) {
//     return res.status(404).json({
//       error: "Scan folder not found"
//     });
//   }

//   try {
//     const files = walkFiles(scanFolderPath);

//     const ans = {};

//     for (const filePath of files) {
//       const code = readFileSafe(filePath);
//       if (!code) continue;

//       // 🔐 Limit code size sent to Gemini
//       const limitedCode = code.split("\n").slice(0, 120).join("\n");

//       const findings = detectVulnerableLines(limitedCode);

//       // If no vulnerabilities, skip file
//       if (!findings.length) continue;

//       ans[filePath] = [];

//       for (const finding of findings) {
//         const aiResult = await explainWithGemini(
//           finding.lineContent,
//           `${filePath}:${finding.lineNumber}`
//         );

//         ans[filePath].push([
//           finding.lineContent,  // ❌ vulnerable line
//           aiResult.secure,      // ✅ secure replacement
//           aiResult.why          // 🧠 explanation
//         ]);
//       }

//     }

//     return res.json({
//       scanId,
//       ans
//     });

//   } catch (err) {
//     console.error("Static scan failed:", err);
//     return res.status(500).json({
//       error: "Static scan failed"
//     });
//   }
// });

// export default router;


import express from "express";
import path from "path";
import fs from "fs";

import { explainWithGemini } from "../utils/geminiExplain.js";
import { walkFiles } from "../utils/fileWalker.js";
import { readFileSafe } from "../utils/readFileSafe.js";

const router = express.Router();
router.get("/:scanId", async (req, res) => {
  const { scanId } = req.params;

  const scanFolder = path.join(
    process.cwd(),
    "tmp",
    "nik",
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
