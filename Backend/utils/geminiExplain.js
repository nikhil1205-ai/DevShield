import { callGemini } from "./geminiClient.js";

/**
 * @param {string} code      → source code (already size-limited)
 * @param {string} filePath → file path for context
 */
export async function explainWithGemini(code, filePath) {
  const prompt = `
You are a secure code reviewer.

File Path:
${filePath}

Source Code:
${code}

Respond in the EXACT format below (do not add extra text):

❌ Vulnerable Code:
<code>

✅ Secure Code:
<code>

Why this code?
<simple explanation for beginners>
`;

  const response = await callGemini(prompt);

  // 🛡️ HARD SAFETY FALLBACK
  if (!response || typeof response !== "string") {
    return {
      vulnerable: code.slice(0, 300),
      secure: "Use environment variables, validation, and secure APIs.",
      why: "This pattern can introduce security risks if sensitive data is exposed."
    };
  }

  // 🧠 SAFE PARSING
  const vulnerable =
    response.split("❌ Vulnerable Code:")[1]?.split("✅ Secure Code:")[0]?.trim()
    || code.slice(0, 300);

  const secure =
    response.split("✅ Secure Code:")[1]?.split("Why this code?")[0]?.trim()
    || "Follow secure coding best practices.";

  const why =
    response.split("Why this code?")[1]?.trim()
    || "This code pattern can expose the application to security vulnerabilities.";

  return {
    vulnerable,
    secure,
    why
  };
}


