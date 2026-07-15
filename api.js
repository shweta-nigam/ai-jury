import express from "express";

import { askClaude } from "./agents/claude.js";
import { askGPTOSS } from "./agents/gpt-oss.js";
import { askLlama } from "./agents/llama.js";
import { askQwen } from "./agents/qwen.js";
import { judge } from "./judge.js";

const router = express.Router();

router.post("/claude", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await askClaude(question);

    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/gpt-oss", async (req, res) => {
  try {
    const { question } = req.body;
 console.log("Reached GPT-OSS");
    const response = await askGPTOSS(question);

    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/llama", async (req, res) => {
  try {
    const { question } = req.body;
 console.log("Reached Llama");
    const response = await askLlama(question);

    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/qwen", async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Reached qwen route");

    console.log(req.body);

    const response = await askQwen(question);
    console.log("response of thr qwen", response);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/judge", async (req, res) => {
  try {
    const { question, responses } = req.body;
 console.log("Reached judge");
    const finalAnswer = await judge(question, responses);
console.log("final answer-------", finalAnswer)
    return res.json(finalAnswer);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
