import { explainWithGemini } from "../utils/geminiExplain.js";

import express from "express";
const router = express.Router();

router.get("/staticscan", async (req, res) => {
  const scanId = req.params.scanId;

  // DEMO finding (replace with real SAST output)
  const finding = {
    type: "HARDCODED_SECRET",
    severity: "HIGH",
    file: "auth_controller.js",
    snippet: "const password = '12345';"
  };

  const ai = await explainWithGemini(finding);

  res.json({
    scanId,
    findings: [
      {
        ...finding,
        ai
      }
    ]
  });
});



export default router;