# Prompt Engineering Lab Notes

Prompt engineering is the practice of structuring instructions and context so a language model can produce a useful, reliable response. A strong prompt usually makes the task explicit, provides only the context needed, and states important constraints such as output format, audience, length, or allowed tools.

## A practical structure

A useful prompt often contains four parts:

1. **Task** — say exactly what the model should do.
2. **Context** — provide the information the answer should use.
3. **Constraints** — specify boundaries, format, tone, or exclusions.
4. **Examples** — when consistency matters, show one or two examples of the desired pattern.

For longer prompts, lightweight XML-style tags such as `<context>`, `<requirements>`, and `<example>` can separate different kinds of information. The tags are organizational aids; they do not create security boundaries by themselves.

## Iterate and evaluate

Prompting should be treated as an engineering loop rather than a one-shot activity. Start with the smallest clear prompt, test it on representative inputs, identify recurring failure modes, then revise the instructions. Compare revisions using the same evaluation examples so that changes are evidence-based rather than based on one impressive response.

When a task is underspecified, prefer adding a concrete requirement instead of vague words such as “better” or “professional.” For example, replace “make this better” with “rewrite this for a first-year engineering student, preserve all technical terms, and use at most five bullets.”

## Prompt injection awareness

Content supplied by users, webpages, documents, or retrieved files may contain instructions that conflict with the actual application rules. Treat retrieved or quoted content as data unless the application explicitly intends it to provide instructions. Never reveal secrets, hidden prompts, credentials, or private data because untrusted content asks for them.

A good prompt does not guarantee a correct answer. Important outputs should still be checked against trusted references, tests, or human review.
