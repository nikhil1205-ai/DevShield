/**
 * Detect vulnerability SECTIONS using simple heuristics.
 * Each finding returns a multi-line code block.
 */

export function detectVulnerabilitySections(code) {
  const findings = [];

  // 🔴 Hardcoded Secrets (config blocks)
  if (code.includes("password") || code.includes("JWT_SECRET")) {
    findings.push({
      type: "HARDCODED_SECRETS",
      severity: "HIGH",
      section: extractConfigBlock(code)
    });
  }

  // 🔴 SQL Injection
  if (code.match(/SELECT[\s\S]*\$\{|\+'\s*\$\{|\+'\s*\+/i)) {
    findings.push({
      type: "SQL_INJECTION",
      severity: "CRITICAL",
      section: extractBetween(code, "SELECT", ");")
    });
  }

  // 🔴 Remote Code Execution
  if (code.includes("eval(")) {
    findings.push({
      type: "RCE",
      severity: "CRITICAL",
      section: extractRouteBlock(code, "eval(")
    });
  }

  // 🔴 Insecure CORS
  if (code.includes('cors({ origin: "*"')) {
    findings.push({
      type: "INSECURE_CORS",
      severity: "MEDIUM",
      section: 'app.use(cors({ origin: "*" }));'
    });
  }

  // 🔴 Hardcoded Backdoor
  if (code.includes("admin123")) {
    findings.push({
      type: "BACKDOOR_AUTH",
      severity: "CRITICAL",
      section: extractRouteBlock(code, "admin123")
    });
  }

  return findings;
}

/* ---------- Helpers ---------- */

function extractConfigBlock(code) {
  const start = code.indexOf("mysql.createConnection");
  if (start === -1) return "";
  return code.slice(start, start + 400);
}

function extractRouteBlock(code, keyword) {
  const idx = code.indexOf(keyword);
  if (idx === -1) return "";
  const start = code.lastIndexOf("app.", idx);
  const end = code.indexOf("});", idx);
  return code.slice(start, end + 3);
}

function extractBetween(code, startKey, endKey) {
  const start = code.indexOf(startKey);
  const end = code.indexOf(endKey, start);
  return code.slice(start, end + endKey.length);
}
