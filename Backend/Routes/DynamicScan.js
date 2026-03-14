import express from "express";
import axios from "axios";
import {Gemini_APISchema} from "../utils/gemini_API_Schema_code.js";

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

    console.log("SCHEMA RECEIVED:", Object.keys(schema));

    const response = await axios.post(
      "http://localhost:9000/PYdast/apiSchema",
      { schema }
    );
    
    let result =Gemini_APISchema(schema,response.data);
    res.json(result);

  } catch (error) {

    console.log("NODE ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Python DAST service failed"
    });

  }

});



export default router;
