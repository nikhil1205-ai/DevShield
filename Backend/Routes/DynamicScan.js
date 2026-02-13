import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("BODY:", req.body);
  const { url } = req.body;

  try {
    const response = await axios.post("http://localhost:9000/PYdast/scan", {
      url: url
    });

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: "Python DAST service failed"
    });
  }
});

export default router;
