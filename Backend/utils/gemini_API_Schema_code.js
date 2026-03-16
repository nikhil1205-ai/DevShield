import { callGemini } from "./geminiClient.js";

export const Gemini_APISchema = async (schema, ruleFindings) => {

  const prompt = `
    You are an API security expert.

    A rule-based security scanner has already analyzed an OpenAPI schema and detected the following vulnerabilities:

    Rule-Based Findings:
    ${JSON.stringify(ruleFindings, null, 2)}

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

    {
      "validated_rule_findings": [
        {
          "type": "string",
          "endpoint": "string",
          "severity": "LOW | MEDIUM | HIGH | CRITICAL",
          "status": "confirmed | false_positive",
          "reason": "short explanation"
        }
      ],
      "additional_vulnerabilities": [
        {
          "type": "string",
          "endpoint": "string",
          "severity": "LOW | MEDIUM | HIGH | CRITICAL",
          "reason": "short explanation"
        }
      ],
      "summary": "short security summary of the API"
    }

    OpenAPI Schema:
    ${JSON.stringify(schema).slice(0, 4000)}
    `;

  const result = await callGemini(prompt);

  return result;
};