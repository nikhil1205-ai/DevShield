import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (err) {
    console.error("Gemini error:", err.message);
    return null; // never crash backend
  }
}
