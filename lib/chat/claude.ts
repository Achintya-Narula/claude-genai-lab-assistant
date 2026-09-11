import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ChatTurn } from "./types";

export class MissingApiKeyError extends Error {
  constructor(message = "ANTHROPIC_API_KEY is not configured") {
    super(message);
    this.name = "MissingApiKeyError";
  }
}

type GenerateInput = {
  system: string;
  messages: ChatTurn[];
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function generateClaudeReply({ system, messages }: GenerateInput): Promise<string> {
  const response = await getClient().messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
    max_tokens: 900,
    system,
    messages: messages.map((turn) => ({ role: turn.role, content: turn.content })),
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude returned no text content.");
  }

  return text;
}
