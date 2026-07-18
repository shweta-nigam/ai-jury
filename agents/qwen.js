import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

console.log("GROQ: qwen ----------", process.env.GROQ_API_KEY?.slice(0, 8));
// note:
// basic JS: Keep the client outside of the function to create client only once.
// If you keep it inside the function client variable disappear because of the function scope

export async function askQwen(question) {
  try {
    const response = await client.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "system",
          content: `
You are an expert AI assistant.

Rules:
- Answer directly.
- Never reveal your reasoning process.
- Never output <think> tags.
- Use clear paragraphs.
- Use Markdown headings and bullet lists only when they improve readability.
- Avoid unnecessary introductions.
- Keep the answer concise but complete.
- Do not say "Here's my answer".
- Respond in under 250 words unless the question requires more detail.
`,
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_completion_tokens: 300, // token limit
    });

    // console.log(await askQwen("Why is the space black?"));  // recursive call - dangerous
    // console.log("qwen response ----------------------- ", response.choices[0].message.content)
    // return response.choices[0].message.content;

    const answer = response.choices[0].message.content
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();

    return {
      success: true,
      model: "Qwen",
      answer,
    };
  } catch (error) {
    if (error.status === 429) {
      // 429 = too many request
      console.log("qwen rate limit reached. Try again in a few seconds.");
    }

    if (error.status === 429) {
      console.log("qwen rate limit reached.");
    }

    return {
      success: false,
      model: "Qwen",
      error: error.message,
    };
  }
}

// tpm  = tokens per minute :  a rate limit metric that defines the maximum number of text units (tokens) an API user can send and receive within a one-minute window.
