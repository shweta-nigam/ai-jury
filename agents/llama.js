import "dotenv/config";
import OpenAI from "openai";

  const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
  })
  

export async function askLlama(question){
    
try {

  const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      max_completion_tokens: 600
  })
  
  // console.log("llama response---------------------",response.choices[0].message.content)
  
  // return response.choices[0].message.content
    return {
      success: true,
      model: "Llama",
      answer: response.choices[0].message.content,
    };
} catch (error) {
  if (error.status === 429) {
      console.log("llama rate limit reached.");
   }

   return {
      success: false,
      model: "Llama",
      error: error.message,
    };
}
}

