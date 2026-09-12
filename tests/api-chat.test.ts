import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/chat/claude", () => ({
  MissingApiKeyError: class MissingApiKeyError extends Error {},
  generateClaudeReply: vi.fn(),
}));

import { generateClaudeReply, MissingApiKeyError } from "@/lib/chat/claude";
import { POST } from "@/app/api/chat/route";

const mockGenerate = vi.mocked(generateClaudeReply);
const valid = {
  message: "How should I structure a prompt?",
  mode: "explain",
  topic: "prompt-engineering",
  history: [],
};

function request(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    mockGenerate.mockReset();
  });

  it("returns Claude's reply and source metadata", async () => {
    mockGenerate.mockResolvedValue("Use a clear task and constraints.");
    const response = await POST(request(valid));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.reply).toBe("Use a clear task and constraints.");
    expect(body.source.sourceLabel).toBe("Prompt Engineering Lab Notes");
    expect(mockGenerate).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid input", async () => {
    expect((await POST(request({ ...valid, message: " " }))).status).toBe(400);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{not-json",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 500 when the server API key is missing", async () => {
    mockGenerate.mockRejectedValue(new MissingApiKeyError("missing"));
    const response = await POST(request(valid));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Server is missing ANTHROPIC_API_KEY." });
  });

  it("returns 502 without leaking upstream details", async () => {
    mockGenerate.mockRejectedValue(new Error("secret upstream details"));
    const response = await POST(request(valid));
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("secret upstream details");
  });
});
