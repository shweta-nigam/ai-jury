const BASE_URL = "http://localhost:3000/api";

async function callAgent(agent, question) {
  try {
    const response = await fetch(`${BASE_URL}/${agent}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}


export function askClaude(question) {
  return callAgent("claude", question);
}

export function askLlama(question) {
  return callAgent("llama", question);
}

export function askGPTOSS(question) {
  return callAgent("gpt-oss", question);
}

export function askQwen(question) {
  return callAgent("qwen", question);
}