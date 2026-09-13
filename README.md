# Claude GenAI Lab Assistant

[![CI](https://github.com/Achintya-Narula/claude-genai-lab-assistant/actions/workflows/ci.yml/badge.svg)](https://github.com/Achintya-Narula/claude-genai-lab-assistant/actions/workflows/ci.yml)

A compact Claude-powered teaching assistant for hands-on university GenAI labs. Students choose a lab topic and a learning mode, then ask a question, paste a prompt, or share a small debugging problem. The server grounds the request in curated local lab notes before sending it to Claude.

> This is an independent student project by Achintya Narula. It is not an official Anthropic product.

## Why I built it

I have helped students during hands-on GenAI lab sessions and wanted a small project that demonstrates a practical educational use of Claude rather than a generic chatbot. The design deliberately favors explainable architecture, progressive learning support, local context, and server-side secret handling.

## Features

- Claude-powered lab chat using Anthropic's Messages API.
- Three curated local topics: Prompt Engineering, LLM/API Basics, and Responsible AI.
- Four educational modes: Explain, Hint, Debug, and Prompt Coach.
- Context-grounded responses with visible source metadata.
- Server-only Anthropic API key handling.
- Request validation and safe upstream error responses.
- Responsive keyboard-friendly interface.
- Unit tests for validation, context loading, prompt behavior, and the API route.
- Repository-level `CLAUDE.md` for working with Claude Code.

## Learning modes

| Mode | Behavior |
| --- | --- |
| **Explain** | Teaches the concept in plain language, includes a short example, and asks a checkpoint question. |
| **Hint** | Gives one progressive hint rather than immediately revealing the complete answer. |
| **Debug** | Identifies likely causes, suggests the smallest diagnostic step, then the smallest useful fix. |
| **Prompt Coach** | Critiques a prompt, explains weaknesses, proposes a stronger version, and explains the changes. |

## Architecture and data flow

```text
Student browser
    |
    | POST /api/chat
    v
Next.js server route
    |-- validate request
    |-- load selected content/labs/*.md
    |-- build learning-mode system prompt
    v
Anthropic Messages API (Claude)
    |
    v
Safe JSON response + source metadata
    |
    v
Student transcript
```

The browser never receives the Anthropic API key. The server reads `ANTHROPIC_API_KEY` from its environment and uses `claude-sonnet-5` by default. `ANTHROPIC_MODEL` can override the model without changing source code.

## Local setup

Requirements: Node.js 20+ and an Anthropic API key.

```bash
git clone https://github.com/Achintya-Narula/claude-genai-lab-assistant.git
cd claude-genai-lab-assistant
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
ANTHROPIC_API_KEY=your_real_key_here
ANTHROPIC_MODEL=claude-sonnet-5
```

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Server-side credential for Anthropic's API. |
| `ANTHROPIC_MODEL` | No | Overrides the default `claude-sonnet-5` model. |

Never put the key in a `NEXT_PUBLIC_*` variable or commit `.env.local`.

## Tests

```bash
npm run test:run
npx tsc --noEmit
npm run build
```

The test suite covers request validation, topic/context selection, mode-specific prompt construction, and API-route behavior with the Claude adapter mocked.

## Project structure

```text
app/
  api/chat/route.ts      # server endpoint
  page.tsx               # student chat UI
  globals.css            # responsive styles
content/labs/            # curated lab grounding notes
lib/chat/
  claude.ts              # Anthropic SDK adapter
  context.ts             # local context loader
  prompt.ts              # educational prompt builder
  types.ts               # shared types/enums
  validation.ts          # input validation
tests/                   # Vitest tests
CLAUDE.md                 # Claude Code project guidance
.env.example              # safe environment template
```

## Security choices

- The API key is read only in `lib/chat/claude.ts`, a server-only module.
- The client calls the application's `/api/chat` route rather than Anthropic directly.
- Requests reject blank/oversized inputs and invalid topics or modes.
- Upstream failures are converted to generic user-facing responses so internal details are not leaked.
- Retrieved lab text is explicitly marked as reference material, not trusted instructions, to reduce prompt-injection risk.

## Understanding the request flow

A useful way to understand the project is to trace one request:

1. `app/page.tsx` creates `{ message, mode, topic, history }`.
2. `lib/chat/validation.ts` validates and normalizes the request.
3. `lib/chat/context.ts` loads one local Markdown topic.
4. `lib/chat/prompt.ts` creates the mode-specific educational instructions.
5. `lib/chat/claude.ts` sends the request to Claude through Anthropic's SDK.
6. `app/api/chat/route.ts` returns the answer and source metadata to the UI.

The project intentionally avoids a vector database because three small curated lab files do not need one. That keeps the retrieval behavior transparent and makes the trade-off easy to explain.

## Attribution

This independent student project was inspired by architecture and integration patterns demonstrated in Anthropic's public [`claude-quickstarts`](https://github.com/anthropics/claude-quickstarts) repository. The campus GenAI lab use case, curated learning modes, local-topic grounding design, prompts, interface, tests, and implementation in this repository are an adaptation for learning and portfolio purposes.

Anthropic and Claude are trademarks of their respective owner. This repository is not affiliated with, endorsed by, or an official product of Anthropic.

## License

MIT — see [LICENSE](LICENSE).
