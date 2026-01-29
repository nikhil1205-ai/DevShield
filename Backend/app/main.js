import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import unzipper from "unzipper";
import cors from "cors";

const app = express();

/* ===============================
   CORS CONFIG
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ===============================
   MULTER CONFIG (MEMORY)
================================ */
const upload = multer({
  storage: multer.memoryStorage()
});

/* ===============================
   HELPERS
================================ */

// sanitize project name to avoid path traversal
function safeProjectName(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_");
}

// create workspace
function createWorkspace(scanId, projectName) {
  const workspace = path.join(
    process.cwd(),
    "tmp",
    projectName,
    `scan_${scanId}`,
    "project"
  );

  fs.mkdirSync(workspace, { recursive: true });
  return workspace;
}

// delete workspace
function deleteWorkspace(scanId, projectName) {
  const scanPath = path.join(
    process.cwd(),
    "tmp",
    projectName,
    `scan_${scanId}`
  );

  if (fs.existsSync(scanPath)) {
    fs.rmSync(scanPath, { recursive: true, force: true });
  }
}

/* ===============================
   ROUTES
================================ */

app.post("/api/scan", upload.any(), async (req, res) => {
  const scanId = Date.now();
  const { projectName, sourceType, repoUrl } = req.body;

  if (!projectName) {
    return res.status(400).json({
      success: false,
      error: "Project name is required"
    });
  }

  const safeName = safeProjectName(projectName);

  console.log("📦 New Scan:", {
    scanId,
    projectName: safeName,
    sourceType
  });

  const workspace = createWorkspace(scanId, safeName);

  try {
    /* ---------- GITHUB ---------- */
    if (sourceType === "github") {
      if (!repoUrl) {
        return res.status(400).json({
          success: false,
          error: "Repository URL is required"
        });
      }

      await new Promise((resolve, reject) => {
        exec(
          `git clone --depth=1 ${repoUrl} "${workspace}"`,
          { timeout: 60_000 },
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    /* ---------- ZIP ---------- */
    else if (sourceType === "zip") {
      const zipFile = req.files?.[0];
      if (!zipFile) {
        return res.status(400).json({
          success: false,
          error: "ZIP file missing"
        });
      }

      await unzipper.Open.buffer(zipFile.buffer).then((zip) =>
        zip.extract({ path: workspace })
      );
    }

    /* ---------- FOLDER ---------- */
    else if (sourceType === "folder") {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Folder files missing"
        });
      }

      for (const file of req.files) {
        const relativePath = file.originalname;
        const fullPath = path.join(workspace, relativePath);

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, file.buffer);
      }
    }

    else {
      return res.status(400).json({
        success: false,
        error: "Invalid source type"
      });
    }

    console.log("✅ Workspace ready:", workspace);

    return res.json({
      success: true,
      scanId,
      projectName: safeName,
      message: "Workspace created successfully"
    });

  } catch (err) {
    console.error("❌ Scan failed:", err.message);
    deleteWorkspace(scanId, safeName);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ===============================
   SERVER
================================ */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 DevShield backend running on port ${PORT}`);
});
