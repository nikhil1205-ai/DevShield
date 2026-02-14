import re
import math
from collections import Counter
from typing import List, Dict


# -----------------------------
# Utility: Mask Secret
# -----------------------------
def mask_secret(secret: str, visible: int = 4) -> str:
    if "\n" in secret:
        return "[MULTILINE SECRET REDACTED]"
    if len(secret) <= visible * 2:
        return secret
    return secret[:visible] + "*" * (len(secret) - visible * 2) + secret[-visible:]


# -----------------------------
# Utility: Entropy Calculation
# -----------------------------
def calculate_entropy(data: str) -> float:
    if not data:
        return 0
    probabilities = [n / len(data) for n in Counter(data).values()]
    return -sum(p * math.log2(p) for p in probabilities)


# -----------------------------
# Load & Compile Patterns Once
# -----------------------------
def load_patterns():

    raw_patterns = [
        {
            "name": "AWS Access Key",
            "regex": r"AKIA[0-9A-Z]{16}",
            "severity": "High",
            "category": "Cloud Credential",
            "confidence": "High"
        },
        {
            "name": "Google API Key",
            "regex": r"AIza[0-9A-Za-z-_]{35}",
            "severity": "High",
            "category": "API Key",
            "confidence": "High"
        },
        {
            "name": "JWT Token",
            "regex": r"eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+",
            "severity": "Medium",
            "category": "Authentication Token",
            "confidence": "Medium"
        },
        {
            "name": "Private Key",
            "regex": r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----.*?-----END (RSA |EC |OPENSSH )?PRIVATE KEY-----",
            "severity": "Critical",
            "category": "Cryptographic Secret",
            "confidence": "High"
        },
        {
            "name": "GitHub Token",
            "regex": r"ghp_[A-Za-z0-9]{36}",
            "severity": "High",
            "category": "API Token",
            "confidence": "High"
        },
        {
            "name": "Email Exposure",
            "regex": r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            "severity": "Low",
            "category": "PII",
            "confidence": "Low"
        }
    ]

    # Compile regex
    for pattern in raw_patterns:
        pattern["compiled"] = re.compile(pattern["regex"], re.DOTALL)

    return raw_patterns


# -----------------------------
# Entropy-Based Detection
# -----------------------------
def entropy_scan(body: str) -> List[Dict]:

    findings = []
    tokens = re.finditer(r"[A-Za-z0-9+/=_-]{20,}", body)

    for match in tokens:
        token = match.group()
        entropy = calculate_entropy(token)

        if entropy > 4.5:
            line_number = body[:match.start()].count("\n") + 1

            findings.append({
                "type": "High Entropy String",
                "category": "Possible Secret",
                "severity": "Medium",
                "confidence": "Low",
                "line": line_number,
                "masked_value": mask_secret(token),
                "entropy": round(entropy, 2)
            })

    return findings


# -----------------------------
# Main Detection Function
# -----------------------------
def detect_leaks(body: str) -> List[Dict]:

    findings = []
    patterns = load_patterns()

    for pattern in patterns:

        for match in pattern["compiled"].finditer(body):

            secret = match.group()
            line_number = body[:match.start()].count("\n") + 1

            findings.append({
                "type": pattern["name"],
                "category": pattern["category"],
                "severity": pattern["severity"],
                "confidence": pattern["confidence"],
                "line": line_number,
                "masked_value": mask_secret(secret),
            })

    # Add entropy-based detection
    findings.extend(entropy_scan(body))

    return findings
