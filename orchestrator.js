// this file is responsible coordinating agents and collecting responses , and not to answer questions.
// this file is the only file that rest of the application should call.

import { askClaude } from "./agents/claude.js";
import { askLlama } from "./agents/llama.js";
import { askQwen } from "./agents/qwen.js";
import { askGPTOSS } from "./agents/gpt-oss.js";

export async function orchestrate(question, onAgentResult) {
  const agents = [
    { name: "Claude", fn: askClaude },
    { name: "Llama", fn: askLlama },
    { name: "Qwen", fn: askQwen },
    { name: "GPT-OSS", fn: askGPTOSS },
  ];

  const promises = agents.map(async (agent) => {
    try {
      const result = await agent.fn(question);
      if (onAgentResult) {
        onAgentResult({ type: "agent-result", result });
      }
      return result;
    } catch (error) {
      const failedResult = {
        success: false,
        model: agent.name,
        error: error.message || "Failed to get response",
      };
      if (onAgentResult) {
        onAgentResult({ type: "agent-result", result: failedResult });
      }
      return failedResult;
    }
  });

  const responses = await Promise.all(promises);
  const successful = responses.filter(r => r.success);

  if (successful.length < 2) {
    throw new Error("Not enough successful responses.");
  }

  return successful;
}





// const answers = await Promise.all()

// const c = answers[0]
// const l = answers[1]
// const q = answers[2]
