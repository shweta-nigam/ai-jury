# AI Jury

AI Jury is a multi-agent AI application that improves answer reliability by cross-examining multiple Large Language Models (LLMs).

Instead of relying on a single model, AI Jury sends the same prompt to multiple AI models simultaneously. Their responses are then analyzed by a judge model, which compares the outputs, filters incorrect or inconsistent information, and generates a single refined answer.

---

## Features

- Query multiple AI models simultaneously
- Parallel execution for faster responses
- AI-powered answer synthesis
- Graceful handling of model failures
- Modular architecture for adding new models
- Simple web interface
- Environment variable support

---

## How It Works

```
                User Prompt
                     │
                     ▼
          ┌──────────────────┐
          │   Orchestrator   │
          └──────────────────┘
           │      │      │
           ▼      ▼      ▼
        Claude  GPT-OSS  Qwen
           │      │      │
           └──────┼──────┘
                  ▼
            Judge Model
                  │
                  ▼
          Final Refined Answer
```

---

## Project Structure

```
ai-jury/
│
├── agents/
│   ├── claude.js
│   ├── gpt-oss.js
│   ├── qwen.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── orchestrator.js
├── judge.js
├── index.js
├── package.json
└── .env
```

---

## Tech Stack

- Node.js
- Express.js
- Anthropic SDK
- OpenAI SDK
- Google GenAI SDK
- Groq API
- HTML
- CSS
- JavaScript

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ai-jury.git
```

Navigate to the project directory:

```bash
cd ai-jury
```

Install dependencies:

```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## Running the Project

Start the development server:

```bash
pnpm dev
```

or

```bash
node index.js
```

Open the application in your browser:

```
http://localhost:3000
```

---

## AI Models

The project currently integrates:

- Claude
- GPT-OSS
- Qwen

The architecture is modular, making it easy to integrate additional models such as:

- Gemini
- Llama
- DeepSeek
- Mistral

---

## Multi-Agent Workflow

1. The user submits a prompt.
2. The orchestrator sends the prompt to multiple AI models concurrently.
3. Each model generates an independent response.
4. The judge model evaluates all responses.
5. The judge combines the strongest factual information into a single final answer.

This approach reduces dependence on a single model and improves response quality through cross-model reasoning.

---

## Future Improvements

- Support for additional LLM providers
- Streaming responses
- Response citations
- Confidence scoring
- Conversation history
- File upload support
- Markdown rendering
- Model voting visualization

---

## License

This project is licensed under the MIT License.

---

## Author

**Shweta**

Built as part of my GenAI learning journey to explore multi-agent reasoning, AI orchestration, and answer synthesis using multiple language models.