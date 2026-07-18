import { askJudge } from "./api.js";
import { askGPTOSS } from "./api.js";
import { askLlama } from "./api.js";
import { askQwen } from "./api.js";


const gptBox = document.querySelector("#gpt-output");
const qwenBox = document.querySelector("#qwen-output");
const llamaBox = document.querySelector("#llama-output");

const judgeBox = document.querySelector("#judge-output");

const button = document.querySelector(".send-btn");

const textarea = document.querySelector("textarea");

button.addEventListener("click", handleQuestion);

async function handleQuestion() {
  try {
    button.disabled = true;
    const question = textarea.value.trim();

    if (!question) {
      judgeBox.textContent = "Please enter a question.";

      return;
    }

    gptBox.textContent = "";
qwenBox.textContent = "";
llamaBox.textContent = "";
judgeBox.textContent = "";



    gptBox.textContent = "Thinking...";
    qwenBox.textContent = "Thinking...";
    llamaBox.textContent = "Thinking...";
    judgeBox.textContent = "Waiting for all models...";
    button.textContent = "...";

    const gptPromise = askGPTOSS(question);

    const qwenPromise = askQwen(question);

    const llamaPromise = askLlama(question);

    gptPromise.then((result) => {
      if (result.success) {
        gptBox.textContent = result.answer;
      } else {
        gptBox.textContent = result.error;
      }
    });

    qwenPromise.then((result) => {
      if (result.success) {
        qwenBox.textContent = result.answer;
      } else {
        qwenBox.textContent = result.error;
      }
    });

    llamaPromise.then((result) => {
      if (result.success) {
        llamaBox.textContent = result.answer;
      } else {
        llamaBox.textContent = result.error;
      }
    });

    const [gpt, qwen, llama] = await Promise.all([
      gptPromise,
      qwenPromise,
      llamaPromise,
    ]);

    judgeBox.textContent = "Claude is analyzing...";

   const final = await askJudge(question, [
    gpt,
    qwen,
    llama
]);

    if (final.success) {
      judgeBox.textContent = final.answer;
    } else {
      judgeBox.textContent = final.error;
    }
  } catch (error) {
    judgeBox.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = "↑";
  }
}


//  text- visual ------- judge card UI


const progress = document.querySelector("#judge-progress");
const status = document.querySelector("#judge-status");
const output = document.querySelector("#judge-output");

const steps = [
    "Analyzing model responses...",
    "Comparing reasoning...",
    "Checking factual consistency...",
    "Resolving disagreements...",
    "Building final answer..."
];

let interval = null;
let currentStep = 0;

export function resetJudge(){

    clearInterval(interval);

    progress.classList.add("hidden");

    status.textContent = "";

    output.textContent = "Ask a question to receive the jury's final verdict.";

}

export function startJudge(){

    clearInterval(interval);

    progress.classList.remove("hidden");

    output.textContent = "";

    currentStep = 0;

    status.textContent = steps[0];

    interval = setInterval(()=>{

        currentStep++;

        if(currentStep >= steps.length){

            currentStep = steps.length - 1;

        }

        status.textContent = steps[currentStep];

    },1400);

}

export async function finishJudge(answer){

    clearInterval(interval);

    status.textContent = "Final answer ready.";

    await new Promise(resolve => setTimeout(resolve,700));

    progress.classList.add("hidden");

    output.textContent = answer;

}

export async function judgeError(error){

    clearInterval(interval);

    progress.classList.add("hidden");

    output.textContent = error;

}