import os
import sys
import time
import shutil
import zipfile
import subprocess
import json
from typing import Optional, List, Dict
from fastapi import FastAPI, Form, File, UploadFile, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Local imports
from URLscanner.scanner import run_scan
from APiSchema_Scanner.api_schema_scanner import analyze_schema
from utils.sast_scanner import run_static_scan
from utils.schema_analyzer import gemini_api_schema
from utils.log_analyzer import gemini_log_analysis

app = FastAPI(title="ShieldNet Unified Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TMP_DIR = os.path.join(BASE_DIR, "tmp")

def create_workspace(scan_id: int, project_name: str = "projects") -> str:
    workspace = os.path.join(TMP_DIR, project_name, f"scan_{scan_id}", "project")
    os.makedirs(workspace, exist_ok=True)
    return workspace

def delete_workspace(scan_id: int, project_name: str = "projects"):
    scan_path = os.path.join(TMP_DIR, project_name, f"scan_{scan_id}")
    if os.path.exists(scan_path):
        shutil.rmtree(scan_path, ignore_errors=True)

# -------------------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------------------
@app.get("/")
async def root():
    return {
        "status": "OK",
        "message": "DevShield Unified Python API is running 🚀"
    }

# -------------------------------------------------------------
# WORKSPACE CREATION & SOURCE INGESTION
# -------------------------------------------------------------
@app.post("/api/scan")
async def start_scan(
    request: Request,
    projectName: Optional[str] = Form("projects"),
    sourceType: Optional[str] = Form(None),
    repoUrl: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None)
):
    scan_id = int(time.time() * 1000)
    safe_name = "projects"

    # Also handle JSON body if sent as raw JSON
    if not sourceType:
        try:
            body = await request.json()
            sourceType = body.get("sourceType")
            repoUrl = body.get("repoUrl")
            projectName = body.get("projectName", "projects")
        except Exception:
            pass

    if not sourceType:
        raise HTTPException(status_code=400, detail="sourceType is required")

    print(f"📦 New Scan Received: scanId={scan_id}, sourceType={sourceType}")
    workspace = create_workspace(scan_id, safe_name)

    try:
        # ---------- GITHUB ----------
        if sourceType == "github":
            if not repoUrl:
                raise HTTPException(status_code=400, detail="Repository URL is required")

            fixed_url = repoUrl.strip()
            if not fixed_url.startswith("http"):
                fixed_url = "https://" + fixed_url
            if not fixed_url.endswith(".git"):
                fixed_url += ".git"

            print(f"🚀 Cloning repo: {fixed_url} into {workspace}")
            result = subprocess.run(
                ["git", "clone", "--depth=1", fixed_url, workspace],
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode != 0:
                print(f"❌ Git clone failed: {result.stderr}")
                raise HTTPException(status_code=400, detail=f"Git clone failed: {result.stderr}")

        # ---------- ZIP FILE ----------
        elif sourceType == "zip":
            if not files or len(files) == 0:
                raise HTTPException(status_code=400, detail="ZIP file missing")

            zip_file = files[0]
            temp_zip_path = os.path.join(workspace, "upload.zip")

            with open(temp_zip_path, "wb") as f:
                content = await zip_file.read()
                f.write(content)

            with zipfile.ZipFile(temp_zip_path, "r") as zip_ref:
                zip_ref.extractall(workspace)

            os.remove(temp_zip_path)

        # ---------- FOLDER FILES ----------
        elif sourceType == "folder":
            if not files or len(files) == 0:
                raise HTTPException(status_code=400, detail="Folder files missing")

            for uploaded_file in files:
                relative_path = uploaded_file.filename
                full_path = os.path.join(workspace, relative_path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)

                content = await uploaded_file.read()
                with open(full_path, "wb") as f:
                    f.write(content)

        else:
            raise HTTPException(status_code=400, detail="Invalid source type")

        print(f"✅ Workspace ready at: {workspace}")
        return {
            "success": True,
            "scanId": scan_id,
            "projectName": safe_name,
            "message": "Workspace created successfully"
        }

    except HTTPException:
        delete_workspace(scan_id, safe_name)
        raise
    except Exception as e:
        print(f"❌ Scan failed: {e}")
        delete_workspace(scan_id, safe_name)
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------
# SAST (STATIC SCAN)
# -------------------------------------------------------------
@app.get("/api/scan/staticscan/{scan_id}")
async def get_static_scan(scan_id: str):
    scan_folder = os.path.join(TMP_DIR, "projects", f"scan_{scan_id}", "project")

    if not os.path.exists(scan_folder):
        raise HTTPException(status_code=404, detail="Scan folder not found")

    ans = run_static_scan(scan_folder)
    return {
        "scanId": scan_id,
        "ans": ans
    }

# -------------------------------------------------------------
# DAST (DYNAMIC SCAN) & ROUTE ALIASES
# -------------------------------------------------------------
class ScanRequest(BaseModel):
    url: str

@app.post("/api/scan/dynamicscan")
@app.post("/PYdast/scan")
async def dynamic_scan(data: ScanRequest):
    return run_scan(data.url)

# -------------------------------------------------------------
# API SCHEMA SCANNER
# -------------------------------------------------------------
class SchemaRequest(BaseModel):
    schema: dict

@app.post("/api/scan/dynamicscan/apiSchema")
@app.post("/PYdast/apiSchema")
async def api_schema_scan(data: SchemaRequest):
    try:
        schema = data.schema
        if not schema:
            raise HTTPException(status_code=400, detail="Schema is required")

        rule_analysis = analyze_schema(schema)
        rule_findings = rule_analysis.get("rule_engine_findings", [])

        llm_raw = gemini_api_schema(schema, rule_findings)
        
        try:
            parsed_llm = json.loads(llm_raw)
        except Exception:
            parsed_llm = {
                "validated_rule_findings": [],
                "additional_vulnerabilities": [],
                "summary": llm_raw
            }

        return {
            "rule_engine": rule_findings,
            "llm_analysis": parsed_llm
        }

    except Exception as e:
        print("API Schema Scan Error:", e)
        raise HTTPException(status_code=500, detail="API Schema service failed")

# -------------------------------------------------------------
# LOG ANALYSIS
# -------------------------------------------------------------
class LogsRequest(BaseModel):
    logs: str

@app.post("/api/scan/dynamicscan/logs")
async def log_analysis(data: LogsRequest):
    try:
        if not data.logs:
            raise HTTPException(status_code=400, detail="Logs are required")

        llm_raw = gemini_log_analysis(data.logs)

        try:
            parsed_llm = json.loads(llm_raw)
        except Exception:
            parsed_llm = {
                "issues": [],
                "summary": {
                    "total_issues": 0,
                    "high_severity_count": 0,
                    "risk_level": "UNKNOWN",
                    "message": llm_raw
                }
            }

        return {
            "llm_analysis": parsed_llm
        }

    except Exception as e:
        print("Log Analysis Error:", e)
        raise HTTPException(status_code=500, detail="Log analysis error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
