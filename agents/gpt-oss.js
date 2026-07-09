import "dotenv/config";
import OpenAI from "openai";

 const client = new OpenAI({
     apiKey: process.env.GROQ_API_KEY,
     baseURL: "https://api.groq.com/openai/v1",
 })

export async function askGPTOSS(question){
 try {
     

 
 const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
     messages: [
       {
         role: "user",
         content: question,
       },
     ],
     max_completion_tokens: 300
 })
 
 // console.log("gpt-oss response---------------------",response.choices[0].message.content)
 
//  return response.choices[0].message.content

  return {
      success: true,
      model: "GPT-OSS",
      answer: response.choices[0].message.content,
    };

 } catch (error) {
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

