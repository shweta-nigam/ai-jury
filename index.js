import { orchestrate } from "./orchestrator.js";
import { judge } from "./judge.js";

const question = "what is the difference between sea and ocean?";

const responses = await orchestrate(question);

for (const response of responses) {
    console.log(`\n${response.model}`);
    console.log(response.answer);
}


const finalAnswer = await judge(question, responses);

console.log("\n========== FINAL ANSWER ==========");
console.log(finalAnswer.answer);



