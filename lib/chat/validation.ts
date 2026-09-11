import {
  LAB_TOPICS,
  LEARNING_MODES,
  type ChatRequest,
  type ChatTurn,
  type LabTopic,
  type LearningMode,
  type ValidationResult,
} from "./types";

const MAX_MESSAGE_LENGTH = 8_000;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_CONTENT_LENGTH = 4_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLearningMode(value: unknown): value is LearningMode {
  return typeof value === "string" && LEARNING_MODES.includes(value as LearningMode);
}

function isLabTopic(value: unknown): value is LabTopic {
  return typeof value === "string" && LAB_TOPICS.includes(value as LabTopic);
}

function normalizeHistory(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value) || value.length > MAX_HISTORY_TURNS) {
    return null;
  }

  const turns: ChatTurn[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (item.role !== "user" && item.role !== "assistant") return null;
    if (typeof item.content !== "string") return null;

    const content = item.content.trim();
    if (!content || content.length > MAX_HISTORY_CONTENT_LENGTH) return null;
    turns.push({ role: item.role, content });
  }

  return turns;
}

export function validateChatRequest(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { ok: false, error: "Invalid request body." };
  }

  if (typeof input.message !== "string" || input.message.trim().length === 0) {
    return { ok: false, error: "Message is required." };
  }

  const message = input.message.trim();
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Message is too long." };
  }

  if (!isLearningMode(input.mode)) {
    return { ok: false, error: "Invalid learning mode." };
  }

  if (!isLabTopic(input.topic)) {
    return { ok: false, error: "Invalid lab topic." };
  }

  if (!Array.isArray(input.history)) {
    return { ok: false, error: "Conversation history is invalid." };
  }

  if (input.history.length > MAX_HISTORY_TURNS) {
    return { ok: false, error: "Conversation history is too long." };
  }

  const history = normalizeHistory(input.history);
  if (!history) {
    return { ok: false, error: "Conversation history is invalid." };
  }

  const value: ChatRequest = {
    message,
    mode: input.mode,
    topic: input.topic,
    history,
  };

  return { ok: true, value };
}
