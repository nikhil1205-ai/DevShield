import express from "express";
import axios from "axios";
import {Gemini_APISchema} from "../utils/gemini_API_Schema_code.js";
import {Gemini_LogAnalysis} from "../utils/gemini_Log_Analysis.js"

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("BODY:", req.body);
  const { url } = req.body;

  try {
    const response = await axios.post("http://localhost:9000/PYdast/scan",{
      url: url
    });

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: "Python DAST service failed"
    });
  }
});


router.post("/apiSchema", async (req, res) => {
  try {
    const { schema } = req.body;

    if (!schema) {
      return res.status(400).json({
        error: "Schema is required"
      });
    }

    const response = await axios.post(
      "http://localhost:9000/PYdast/apiSchema",
      { schema }
    );
    
    const ruleFindings = response.data;
    const llmResult = await Gemini_APISchema(schema, ruleFindings);
    const finalResult = {
      rule_engine: ruleFindings,
      llm_analysis: JSON.parse(llmResult) 
    };
    res.json(finalResult);

  } catch (error) {

    console.log("NODE ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Python DAST service failed"
    });

  }

});

router.post("/logs", async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs) {
      return res.status(400).json({ error: "Logs are required" });
    }
    const llmResult = await Gemini_LogAnalysis(logs);
    const finalResult = {
      llm_analysis: JSON.parse(llmResult) 
    };
    res.json(finalResult);

  } catch (error) {
    console.error("Log analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
