import "dotenv/config"
import Anthropic from "@anthropic-ai/sdk"


const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
console.log("Anthropic key--------:", process.env.ANTHROPIC_API_KEY?.slice(0, 8));


export async function askClaude(question){

    
try {
    const message = await client.messages.create({
        max_tokens: 1024,
        messages:[{role: "user", content: question}],
        model:"claude-haiku-4-5-20251001"
    });
    
    // console.log( "claude response ---------------------------", message.content[0].text)
    for (const block of message.content){
        if(block.type === "text"){
            console.log(block.text)
        }
    }
    
    // return message.content[0].text

    return {
      success: true,
      model: "Claude",
      answer: message.content[0].text
    };

} catch (error) {
    if (error.status === 429) {
      console.log("claud rate limit reached.");
   }

   return {
      success: false,
      model: "Claude",
      error: error.message,
    };
}
}