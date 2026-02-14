from fastapi import FastAPI
from pydantic import BaseModel
from URLscanner.scanner import run_scan

app = FastAPI()

class ScanRequest(BaseModel):
    url: str

@app.post("/PYdast/scan")
async def scan(data: ScanRequest):
    return run_scan(data.url)

