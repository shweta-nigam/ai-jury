// this file is responsible coordinating agents and collecting responses , and not to answer questions.
// this file is the only file that rest of the application should call.

import { askClaude } from "./agents/claude.js";
import { askLlama } from "./agents/llama.js";
import { askQwen } from "./agents/qwen.js";
import { askGPTOSS } from "./agents/gpt-oss.js";

export async function orchestrate(question) {
//   const [claude, llama, qwen, gtposs] = await Promise.all([
  const responses = await Promise.all([
    askClaude(question),
    askLlama(question),
    askQwen(question),
    askGPTOSS(question),
  ]);

  const successful = responses.filter(r => r.success)

if (successful.length < 2) {
    throw new Error("Not enough successful responses.");
}

  return successful
}




// const answers = await Promise.all()

// const c = answers[0]
// const l = answers[1]
// const q = answers[2]
