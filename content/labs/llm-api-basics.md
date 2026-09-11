# LLM and API Basics Lab Notes

A language-model application typically has a client interface, a server endpoint, and a call from that server to a model provider. For Claude, a common integration uses the **Messages API** through Anthropic's official SDK.

## Basic request flow

1. The browser sends the student's input to your own server route.
2. The server validates the input and prepares instructions and conversation messages.
3. The server calls the Anthropic Messages API with a model identifier such as `claude-sonnet-5`, a `max_tokens` limit, a system instruction, and user/assistant messages.
4. The model response is returned to the server and then sent back to the browser.

The **API key must remain server-side**. Store it in an environment variable such as `ANTHROPIC_API_KEY`. Do not hard-code it, commit it to Git, print it in logs, or place it in a browser-exposed variable such as a `NEXT_PUBLIC_*` environment variable.

## System and conversation messages

A system instruction defines persistent behavior for a request, such as “act as a concise lab tutor.” User and assistant messages represent the conversation itself. Keep the system instruction focused and avoid placing untrusted user text inside it when that text can remain a normal user message or clearly marked reference context.

## Reliability and errors

Applications should validate empty, malformed, and excessively large inputs before calling the model. Upstream API requests can fail because of network problems, invalid credentials, rate limits, model availability, or request errors. Show users a safe, generic error message and avoid exposing internal stack traces or credentials.

Rate limits are normal operational constraints. Production applications commonly use retries with appropriate backoff for retryable failures, but retries should not be added blindly to every error. Log enough server-side information to diagnose failures without logging secrets or sensitive user content unnecessarily.

Model output should be treated as generated content, not as guaranteed truth. For code, run tests. For facts, verify important claims against trusted sources.
