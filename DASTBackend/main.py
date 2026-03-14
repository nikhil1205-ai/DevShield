from fastapi import FastAPI
from pydantic import BaseModel
from URLscanner.scanner import run_scan
from APiSchema_Scanner.api_schema_scanner import analyze_schema
app = FastAPI()

class ScanRequest(BaseModel):
    url: str

@app.post("/PYdast/scan")
async def scan(data: ScanRequest):
    return run_scan(data.url)


class SchemaRequest(BaseModel):
    schema: dict

@app.post("/PYdast/apiSchema")
async def api_schema_scan(data: SchemaRequest):
    schema = data.schema
    results = analyze_schema(schema)
    return results