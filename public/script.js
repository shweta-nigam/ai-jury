import { askClaude } from "./api";
import { askGPTOSS } from "./api";
import { askLlama } from "./api";
import { askQwen } from "./api";

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

    const final = await askClaude(judgePrompt);

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
