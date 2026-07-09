import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

 const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
async function askGemini(){
   

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'why is the sky blue?'
    })

    console.log( response.text)
}
askGemini()


// api issue 