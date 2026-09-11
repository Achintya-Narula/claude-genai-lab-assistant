import { describe, expect, it } from "vitest";
import { validateChatRequest } from "@/lib/chat/validation";

describe("validateChatRequest", () => {
  const base = {
    message: "Why does a system prompt matter?",
    mode: "explain",
    topic: "prompt-engineering",
    history: [],
  };

  it("accepts and normalizes a valid request", () => {
    expect(validateChatRequest({ ...base, message: "  hello  " })).toEqual({
      ok: true,
      value: { ...base, message: "hello" },
    });
  });

  it("rejects blank messages", () => {
    expect(validateChatRequest({ ...base, message: "   " })).toEqual({
      ok: false,
      error: "Message is required.",
    });
  });

  it("rejects messages over 8,000 characters", () => {
    expect(validateChatRequest({ ...base, message: "x".repeat(8001) })).toEqual({
      ok: false,
      error: "Message is too long.",
    });
  });

  it("rejects unknown modes", () => {
    expect(validateChatRequest({ ...base, mode: "solve-it" })).toEqual({
      ok: false,
      error: "Invalid learning mode.",
    });
  });

  it("rejects unknown topics", () => {
    expect(validateChatRequest({ ...base, topic: "quantum" })).toEqual({
      ok: false,
      error: "Invalid lab topic.",
    });
  });

  it("rejects more than eight history turns", () => {
    const history = Array.from({ length: 9 }, () => ({ role: "user", content: "x" }));
    expect(validateChatRequest({ ...base, history })).toEqual({
      ok: false,
      error: "Conversation history is too long.",
    });
  });

  it("rejects invalid history roles", () => {
    expect(validateChatRequest({ ...base, history: [{ role: "system", content: "x" }] })).toEqual({
      ok: false,
      error: "Conversation history is invalid.",
    });
  });

  it("rejects history items over 4,000 characters", () => {
    expect(validateChatRequest({ ...base, history: [{ role: "user", content: "x".repeat(4001) }] })).toEqual({
      ok: false,
      error: "Conversation history is invalid.",
    });
  });
});
