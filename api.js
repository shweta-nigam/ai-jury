import express from "express";

import { askClaude } from "./agents/claude.js";
import { askGPTOSS } from "./agents/gpt-oss.js";
import { askLlama } from "./agents/llama.js";
import { askQwen } from "./agents/qwen.js";

const router = express.Router();


router.post("/claude", async (req, res) => {
    try {
        const { question } = req.body;

        const response = await askClaude(question)

        res.json(response)

    } catch (error) {
        res.status(500).json({
      success: false,
      error: err.message,
    });
    }
})


router.post("/gpt-oss", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await askGPTOSS(question);

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/llama", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await askLlama(question);

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/qwen", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await askQwen(question);

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
