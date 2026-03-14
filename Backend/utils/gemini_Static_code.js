import { callGemini } from "./geminiClient.js";

/**
 * Gemini-powered section-based SAST
 * @param {string} code      Full file code (limited before calling)
 * @param {string} filePath File path
 * @returns {Array<{section: string, fix: string, why: string}>}
 */
export async function explainWithGemini(code, filePath) {
  const prompt = `
You are a professional static application security testing (SAST) engine.

File path:
${filePath}

Source code:
${code}

TASK:
1. Identify ALL security vulnerabilities in the code.
2. Each vulnerability MUST be a LOGICAL CODE SECTION (multi-line).
3. For EACH vulnerability, provide:
   - The vulnerable code section
   - A secure rewritten version of THAT SECTION
   - A short explanation of why the original section is dangerous

RULES:
- Do NOT explain safe code.
- Do NOT repeat the same vulnerability twice.
- Limit to maximum 5 vulnerabilities.
- Focus on real issues: SQL Injection, RCE, hardcoded secrets, auth flaws, insecure CORS, weak crypto.

RESPOND in STRICT JSON ONLY.
NO markdown.
NO extra text.

JSON FORMAT:
[
  {
    "section": "<vulnerable code section>",
    "fix": "<secure rewritten section>",
    "why": "<why this section is risky>"
  }
]
`;

  const response = await callGemini(prompt);

  // 🛡️ HARD SAFETY
  if (!response || typeof response !== "string") {
    return [];
  }

  try {
    // 🔥 Gemini MUST return JSON
    const parsed = JSON.parse(response);

    // 🧠 Validate structure
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      item =>
        typeof item.section === "string" &&
        typeof item.fix === "string" &&
        typeof item.why === "string"
    );
  } catch (err) {
    console.error("Gemini JSON parse failed:", err.message);
    return [];
  }
}
