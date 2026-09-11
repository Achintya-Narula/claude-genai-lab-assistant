import { describe, expect, it } from "vitest";
import { getTopicInfo, loadLabContext } from "@/lib/chat/context";

describe("lab context", () => {
  it("maps a topic to student-facing metadata", () => {
    expect(getTopicInfo("prompt-engineering")).toEqual({
      id: "prompt-engineering",
      label: "Prompt Engineering",
      sourceLabel: "Prompt Engineering Lab Notes",
    });
  });

  it("loads the selected local markdown context", async () => {
    const context = await loadLabContext("llm-api-basics");
    expect(context).toContain("Messages API");
    expect(context).toContain("API key");
  });
});
