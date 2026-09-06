import json
from .gemini_client import call_gemini
from .sast_scanner import clean_json_response

def gemini_api_schema(schema: dict, rule_findings: list):
    prompt = f"""
You are an API security expert.

A rule-based security scanner has already analyzed an OpenAPI schema and detected the following vulnerabilities:

Rule-Based Findings:
{json.dumps(rule_findings, indent=2)}

Your tasks:

1. Review these rule-based vulnerabilities and confirm if they are valid.
2. Identify any additional security vulnerabilities in the API schema.
3. Provide a short explanation for each vulnerability.

Important instructions:
- Respond ONLY in valid JSON.
- Do not include markdown or code blocks.
- Keep explanations concise (about 150 words total).
- Each vulnerability must include severity and reasoning.

Return JSON in the following format:

{{
  "validated_rule_findings": [
    {{
      "type": "string",
      "endpoint": "string",
      "severity": "LOW | MEDIUM | HIGH | CRITICAL",
      "status": "confirmed | false_positive",
      "reason": "short explanation"
    }}
  ],
  "additional_vulnerabilities": [
    {{
      "type": "string",
      "endpoint": "string",
      "severity": "LOW | MEDIUM | HIGH | CRITICAL",
      "reason": "short explanation"
    }}
  ],
  "summary": "short security summary of the API"
}}

OpenAPI Schema:
{json.dumps(schema)[:4000]}
"""
    raw_res = call_gemini(prompt)
    if not raw_res:
        return json.dumps({
            "validated_rule_findings": [],
            "additional_vulnerabilities": [],
            "summary": "AI Analysis unavailable."
        })

    cleaned = clean_json_response(raw_res)
    if not cleaned:
        return json.dumps({
            "validated_rule_findings": [],
            "additional_vulnerabilities": [],
            "summary": "AI Analysis unavailable (empty response)."
        })
    return cleaned
