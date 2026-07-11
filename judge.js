
import { askLlama, askLlamaStream } from "./agents/llama.js";

export async function judge(question, responses) {

    let prompt = `
You are an impartial AI judge.

The user asked:

${question}

`;

    for (const response of responses) {
        prompt += `
${response.model} answered:

${response.answer}

`;
    }

    prompt += `
Analyze every answer.

Ignore incorrect information.

Merge complementary facts.

Do not mention the models.

Return ONLY the best accurate final answer.
`;

    return await askLlama(prompt);
}

export async function judgeStream(question, responses, onToken) {

    let prompt = `
You are an impartial AI judge.

The user asked:

${question}

`;

    for (const response of responses) {
        prompt += `
${response.model} answered:

${response.answer}

`;
    }

    prompt += `
Analyze every answer.

Ignore incorrect information.

Merge complementary facts.

Do not mention the models.

Return ONLY the best accurate final answer.
`;

    return await askLlamaStream(prompt, onToken);
}