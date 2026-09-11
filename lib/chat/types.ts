export const LEARNING_MODES = ["explain", "hint", "debug", "prompt-coach"] as const;
export const LAB_TOPICS = ["prompt-engineering", "llm-api-basics", "responsible-ai"] as const;

export type LearningMode = (typeof LEARNING_MODES)[number];
export type LabTopic = (typeof LAB_TOPICS)[number];

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  message: string;
  mode: LearningMode;
  topic: LabTopic;
  history: ChatTurn[];
};

export type ValidationResult =
  | { ok: true; value: ChatRequest }
  | { ok: false; error: string };
