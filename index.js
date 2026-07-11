import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { orchestrate } from "./orchestrator.js";
import { judge, judgeStream } from "./judge.js";
import { askClaude } from "./agents/claude.js";
import { askLlama } from "./agents/llama.js";
import { askQwen } from "./agents/qwen.js";
import { askGPTOSS } from "./agents/gpt-oss.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

// API Call Functions
async function callGPTOSS(question) {
  return await askGPTOSS(question);
}

async function callClaude(question) {
  return await askClaude(question);
}

async function callQwen(question) {
  return await askQwen(question);
}

async function callLlama(question) {
  return await askLlama(question);
}

const server = createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Individual API endpoints for GPT-OSS
  if (req.url.startsWith("/api/gpt-oss")) {
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const question = parsedUrl.searchParams.get("question");
      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }
      console.log(`[Server] GET /api/gpt-oss: "${question}"`);
      try {
        const result = await callGPTOSS(question);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk.toString(); });
      req.on("end", async () => {
        try {
          const { question } = JSON.parse(body);
          if (!question) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Question is required" }));
            return;
          }
          console.log(`[Server] POST /api/gpt-oss: "${question}"`);
          const result = await callGPTOSS(question);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }
  }

  // Individual API endpoints for Claude
  if (req.url.startsWith("/api/claude")) {
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const question = parsedUrl.searchParams.get("question");
      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }
      console.log(`[Server] GET /api/claude: "${question}"`);
      try {
        const result = await callClaude(question);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk.toString(); });
      req.on("end", async () => {
        try {
          const { question } = JSON.parse(body);
          if (!question) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Question is required" }));
            return;
          }
          console.log(`[Server] POST /api/claude: "${question}"`);
          const result = await callClaude(question);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }
  }

  // Individual API endpoints for Qwen
  if (req.url.startsWith("/api/qwen")) {
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const question = parsedUrl.searchParams.get("question");
      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }
      console.log(`[Server] GET /api/qwen: "${question}"`);
      try {
        const result = await callQwen(question);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk.toString(); });
      req.on("end", async () => {
        try {
          const { question } = JSON.parse(body);
          if (!question) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Question is required" }));
            return;
          }
          console.log(`[Server] POST /api/qwen: "${question}"`);
          const result = await callQwen(question);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }
  }

  // Individual API endpoints for Llama
  if (req.url.startsWith("/api/llama")) {
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const question = parsedUrl.searchParams.get("question");
      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }
      console.log(`[Server] GET /api/llama: "${question}"`);
      try {
        const result = await callLlama(question);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk.toString(); });
      req.on("end", async () => {
        try {
          const { question } = JSON.parse(body);
          if (!question) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Question is required" }));
            return;
          }
          console.log(`[Server] POST /api/llama: "${question}"`);
          const result = await callLlama(question);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }
  }

  // API endpoint for orchestrating and judging the question (SSE Streaming)
  if (req.url.startsWith("/api/ask") && req.method === "GET") {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const question = parsedUrl.searchParams.get("question");

    if (!question) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Question is required" }));
      return;
    }

    console.log(`[Server] Received real-time stream question: "${question}"`);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      // 1. Run orchestrator, streaming agent results as they complete
      const responses = await orchestrate(question, (event) => {
        if (event.type === "agent-result") {
          sendEvent("agent-result", event.result);
        }
      });

      sendEvent("verdict-start", {});

      // 2. Stream the judge's consensus verdict token-by-token
      const finalAnswer = await judgeStream(question, responses, (token) => {
        sendEvent("verdict-token", { token });
      });

      sendEvent("verdict-end", { success: true, finalAnswer });
      res.end();
    } catch (error) {
      console.error("[Server Stream Error]:", error);
      sendEvent("error", { message: error.message || "Failed to process self-consistency query." });
      res.end();
    }
    return;
  }

  // API endpoint for orchestrating and judging the question (Legacy batch POST)
  if (req.url === "/api/ask" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { question } = JSON.parse(body);
        if (!question) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Question is required" }));
          return;
        }

        console.log(`[Server] Received question: "${question}"`);
        
        // 1. Run orchestrator to gather model answers
        const responses = await orchestrate(question);
        
        // 2. Run judge to consolidate them
        const finalAnswer = await judge(question, responses);

        console.log(`[Server] Successfully completed consensus for question.`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          responses: responses,
          finalAnswer: finalAnswer
        }));
      } catch (error) {
        console.error("[Server Error]:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: false,
          error: error.message || "Failed to process self-consistency query."
        }));
      }
    });
    return;
  }

  // Static files server
  let filePath = req.url === "/" ? "/index.html" : req.url;
  // Remove query params/hashes
  filePath = filePath.split("?")[0].split("#")[0];

  const absolutePath = path.join(__dirname, "public", filePath);

  // Path safety check
  const relativePath = path.relative(path.join(__dirname, "public"), absolutePath);
  const isSafe = relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);

  if (!isSafe && filePath !== "/index.html") {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      const ext = path.extname(absolutePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Server] Self-Consistency Answer Engine listening at http://localhost:${PORT}`);
});
