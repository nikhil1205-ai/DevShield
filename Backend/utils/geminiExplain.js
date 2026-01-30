import { callGemini } from "./geminiClient.js";

export async function explainWithGemini(finding) {
  const prompt = `
You are a secure coding mentor.

Vulnerability: ${finding.type}
Severity: ${finding.severity}

Code snippet:
${finding.snippet}

Explain in simple language:
- What is the issue
- Why it is dangerous
- How attackers exploit it

Then provide:
❌ Vulnerable example
✅ Secure replacement code
`;

  const response = await callGemini(prompt);

  // 🛡️ HARD SAFETY CHECK
  if (!response || typeof response !== "string") {
    return {
      explanation:
        "This vulnerability can allow attackers to compromise the application or expose sensitive data.",
      fix:
        "Avoid hardcoded secrets. Use environment variables or secure configuration management."
    };
  }

  // ✅ SAFE PARSING
  const fixPart = response.includes("✅")
    ? response.split("✅")[1].trim()
    : "Use secure coding best practices such as environment variables.";

  return {
    explanation: response,
    fix: fixPart
  };
}

