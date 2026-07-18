import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
console.log("GROQ: gpt oss ----------", process.env.GROQ_API_KEY?.slice(0, 8));

export async function askGPTOSS(question) {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
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
      max_completion_tokens: 300,
    });

    // console.log("gpt-oss response---------------------",response.choices[0].message.content)

    //  return response.choices[0].message.content

    return {
      success: true,
      model: "GPT-OSS",
      answer: response.choices[0].message.content,
    };
  } catch (error) {
    console.error("error in gpt oss ---------------------------", error);
    if (error.status === 429) {
      console.log("gpt-oss rate limit reached.");
    }

    return {
      success: false,
      model: "gpt-oss",
      error: error.message,
    };
  }
}
