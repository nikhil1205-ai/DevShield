import { callGemini } from "./geminiClient.js";

export const Gemini_APISchema = async (schema, ruleFindings) => {

  const prompt = `
You are an API security expert.

The following vulnerabilities were detected using rule-based scanning:

${JSON.stringify(ruleFindings, null, 2)}

Now analyze the OpenAPI schema and:

1. Confirm if the rule-based vulnerabilities are valid
2. Detect additional vulnerabilities
3. Provide reasoning

Return results in JSON format.

Schema:
${JSON.stringify(schema).slice(0,4000)}
`;

  const result = await callGemini(prompt);

  return result.response;
};