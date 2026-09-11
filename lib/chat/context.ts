import { readFile } from "node:fs/promises";
import path from "node:path";
import type { LabTopic } from "./types";

export type TopicInfo = {
  id: LabTopic;
  label: string;
  sourceLabel: string;
};

const TOPIC_CONFIG: Record<LabTopic, TopicInfo & { filename: string }> = {
  "prompt-engineering": {
    id: "prompt-engineering",
    label: "Prompt Engineering",
    sourceLabel: "Prompt Engineering Lab Notes",
    filename: "prompt-engineering.md",
  },
  "llm-api-basics": {
    id: "llm-api-basics",
    label: "LLM/API Basics",
    sourceLabel: "LLM & API Basics Lab Notes",
    filename: "llm-api-basics.md",
  },
  "responsible-ai": {
    id: "responsible-ai",
    label: "Responsible AI",
    sourceLabel: "Responsible AI Lab Notes",
    filename: "responsible-ai.md",
  },
};

export const TOPICS: TopicInfo[] = Object.values(TOPIC_CONFIG).map(({ filename: _filename, ...info }) => info);

export function getTopicInfo(topic: LabTopic): TopicInfo {
  const { filename: _filename, ...info } = TOPIC_CONFIG[topic];
  return info;
}

export async function loadLabContext(topic: LabTopic): Promise<string> {
  const config = TOPIC_CONFIG[topic];
  const filePath = path.join(process.cwd(), "content", "labs", config.filename);
  return readFile(filePath, "utf8");
}
