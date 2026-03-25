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

// const prompt = `
// You are a professional code reviewer analyzing a GitHub Pull Request.

// File path: \${filePath}

// Source code :
// \${code}

// TASK:
// 1. Identify ALL issues in the code (not just security).
// 2. Issues can include:
//    - Bugs / logical errors
//    - Security problems
//    - Performance issues
//    - Bad coding practices
//    - Code smells / maintainability issues
// 3. Each issue MUST be a LOGICAL CODE SECTION (multi-line).
// 4. For EACH issue, provide:
//    - The problematic code section
//    - A corrected/improved version of THAT SECTION
//    - A short explanation written as a GitHub PR review comment

// RULES:
// - Do NOT explain correct/safe code.
// - Do NOT repeat the same issue twice.
// - Limit to maximum 5 issues.
// - Focus on meaningful, real issues (avoid trivial nitpicks).
// - The explanation ("why") should sound like a PR review comment:
//   - Clearly describe the issue
//   - Mention impact (bug, performance, readability, etc.)
//   - Suggest improvement briefly

// RESPOND in STRICT JSON ONLY.
// NO markdown.
// NO extra text.

// JSON FORMAT:
// [
//   {
//     "section": "<problematic code section>",
//     "fix": "<improved rewritten section>",
//     "why": "<PR review style comment explaining the issue, impact, and suggestion>"
//   }
// ]
// `;

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
