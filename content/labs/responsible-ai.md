# Responsible AI Lab Notes

Responsible use of generative AI means combining useful automation with verification, privacy awareness, fairness, and human judgment. A model can produce fluent answers that are incomplete, outdated, biased, or incorrect, so confidence in wording should never be confused with evidence.

## Verification and uncertainty

For important claims, compare the output with trusted references, source documents, experiments, or tests. When the available evidence is weak, the assistant should say what it knows, what it is uncertain about, and what should be checked next. In software work, generated code should be reviewed and executed against tests before it is trusted.

## Privacy and data handling

Do not paste passwords, API keys, private credentials, or sensitive personal data into prompts unless the application and data policy explicitly support that use. Minimize the amount of personal or confidential information sent to any external service. Secrets belong in protected environment variables or secret-management systems, not source code or chat transcripts.

## Bias and human oversight

Models learn patterns from large datasets and can reproduce stereotypes or uneven performance across groups and contexts. For decisions that materially affect people, AI output should support rather than replace appropriate human review. Check whether evaluation examples represent the users and situations the application is intended to serve.

## Educational assistance

AI can explain concepts, provide hints, critique prompts, and help debug code. In a learning environment, the goal should be to increase understanding rather than simply produce an answer to submit. A useful tutor asks checkpoint questions, encourages students to attempt a step, and explains why a correction works.

Generated material should also be checked for attribution and originality requirements. If a course, event, or organization has rules about AI assistance, those rules take priority. Responsible use includes being transparent about where AI materially contributed when disclosure is required.
