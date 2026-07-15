const BASE_URL =
  typeof process !== "undefined" && process.env?.BASE_URL
    ? process.env.BASE_URL
    : window.location.origin;

async function callAgent(agent, question) {
  try {
    const response = await fetch(`${BASE_URL}/api/${agent}`, {
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

export function askLlama(question) {
  return callAgent("llama", question);
}

export function askGPTOSS(question) {
  return callAgent("gpt-oss", question);
}

export function askQwen(question) {
  return callAgent("qwen", question);
}

export async function askJudge(question, responses) {

    try {

        const response = await fetch(`${BASE_URL}/api/judge`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                question,
                responses
            })

        });

        return await response.json();

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }

}