# CLAUDE.md

## Project purpose

Claude GenAI Lab Assistant is a small student learning application that uses Anthropic's Claude API to support hands-on GenAI labs. It should remain easy to understand file-by-file and easy to discuss in an interview.

The learning experience has four modes: Explain, Hint, Debug, and Prompt Coach. Answers are grounded first in one curated Markdown file selected by the active lab topic.

## Architecture

- `app/page.tsx` — client-side lab UI and conversation state.
- `app/api/chat/route.ts` — server-only request orchestration and error mapping.
- `lib/chat/validation.ts` — validates and normalizes browser requests.
- `lib/chat/context.ts` — selects and loads local lab notes.
- `lib/chat/prompt.ts` — builds the educational system prompt and Claude message history.
- `lib/chat/claude.ts` — server-only Anthropic SDK adapter.
- `content/labs/*.md` — compact grounding material for the three topics.
- `tests/*.test.ts` — Vitest coverage for validation, context, prompts, and the API route.

## Commands

```bash
npm install
npm run dev
npm run test:run
npx tsc --noEmit
npm run build
```

## Development conventions

- Use TypeScript with strict types and small, focused modules.
- Prefer pure functions for validation and prompt construction so behavior is easy to test.
- Add a failing test before changing behavior, then implement the smallest change that makes it pass.
- Keep the interface accessible: semantic labels, keyboard behavior, focus states, and status/error announcements.
- Do not add authentication, persistence, a vector database, AWS Bedrock, uploads, analytics, or other infrastructure unless the design is intentionally revised first.

## Learning-mode contract

- **Explain:** plain-language explanation, one short example, and a checkpoint question.
- **Hint:** one progressive hint at a time; do not immediately reveal a complete answer.
- **Debug:** likely causes, the smallest next diagnostic, then the smallest useful fix.
- **Prompt Coach:** identify weaknesses, explain why they matter, provide an improved prompt, and give a concise rationale.

All modes should use the selected lab context first and explicitly say when the provided lab material is insufficient.

## Security and completion rules

- Never expose `ANTHROPIC_API_KEY` to browser code or `NEXT_PUBLIC_*` variables.
- Preserve the four learning modes and context-grounded behavior.
- Keep changes small and explainable; avoid adding infrastructure not required by the design.
- Run `npm run test:run` and `npm run build` before considering a change complete.
