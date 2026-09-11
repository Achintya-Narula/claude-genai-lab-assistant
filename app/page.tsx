"use client";

import { useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import type { ChatTurn, LabTopic, LearningMode } from "@/lib/chat/types";

type SourceInfo = {
  id: LabTopic;
  label: string;
  sourceLabel: string;
};

type UiTurn = ChatTurn & {
  id: string;
};

const TOPICS: Array<{ id: LabTopic; label: string; description: string }> = [
  {
    id: "prompt-engineering",
    label: "Prompt Engineering",
    description: "Clear tasks, context, constraints, examples, evaluation, and prompt-injection awareness.",
  },
  {
    id: "llm-api-basics",
    label: "LLM/API Basics",
    description: "Messages API flow, system vs user messages, secret hygiene, and API error handling.",
  },
  {
    id: "responsible-ai",
    label: "Responsible AI",
    description: "Verification, privacy, bias, human oversight, uncertainty, and appropriate educational use.",
  },
];

const MODES: Array<{ id: LearningMode; label: string; description: string }> = [
  {
    id: "explain",
    label: "Explain",
    description: "Learn a concept with a compact example and a checkpoint question.",
  },
  {
    id: "hint",
    label: "Hint",
    description: "Get one progressive clue without immediately revealing the full solution.",
  },
  {
    id: "debug",
    label: "Debug",
    description: "Find likely causes, the next diagnostic step, and the smallest useful fix.",
  },
  {
    id: "prompt-coach",
    label: "Prompt Coach",
    description: "Critique a prompt, improve it, and explain why the revision is stronger.",
  },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function HomePage() {
  const [topic, setTopic] = useState<LabTopic>("prompt-engineering");
  const [mode, setMode] = useState<LearningMode>("explain");
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState<UiTurn[]>([]);
  const [source, setSource] = useState<SourceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeTopic = useMemo(() => TOPICS.find((item) => item.id === topic)!, [topic]);
  const activeMode = useMemo(() => MODES.find((item) => item.id === mode)!, [mode]);

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const history = transcript.slice(-8).map(({ role, content }) => ({ role, content }));
    const userTurn: UiTurn = { id: makeId("user"), role: "user", content: trimmed };

    setTranscript((current) => [...current, userTurn]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, mode, topic, history }),
      });

      const body = (await response.json()) as {
        reply?: string;
        source?: SourceInfo;
        error?: string;
      };

      if (!response.ok || !body.reply) {
        throw new Error(body.error || "The assistant could not answer that request.");
      }

      setTranscript((current) => [
        ...current,
        { id: makeId("assistant"), role: "assistant", content: body.reply! },
      ]);
      if (body.source) setSource(body.source);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function clearChat() {
    setTranscript([]);
    setSource(null);
    setError("");
    setMessage("");
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <p className="eyebrow">Student GenAI Lab</p>
        <h1>Claude GenAI Lab Assistant</h1>
        <p className="hero-copy">
          Practice GenAI concepts with context-grounded explanations, progressive hints, debugging guidance,
          and prompt coaching powered by Claude.
        </p>
      </header>

      <section className="workspace" aria-label="GenAI lab assistant workspace">
        <div className="main-column">
          <section className="controls-card" aria-label="Learning controls">
            <div className="control-block">
              <div className="control-heading">
                <span>1</span>
                <div>
                  <h2>Choose a lab topic</h2>
                  <p>{activeTopic.description}</p>
                </div>
              </div>
              <div className="topic-grid" role="radiogroup" aria-label="Lab topic">
                {TOPICS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === topic ? "choice-button selected" : "choice-button"}
                    aria-pressed={item.id === topic}
                    onClick={() => { setTopic(item.id); setSource(null); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-block">
              <div className="control-heading">
                <span>2</span>
                <div>
                  <h2>Select a learning mode</h2>
                  <p>{activeMode.description}</p>
                </div>
              </div>
              <div className="mode-grid" role="radiogroup" aria-label="Learning mode">
                {MODES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === mode ? "mode-button selected" : "mode-button"}
                    aria-pressed={item.id === mode}
                    onClick={() => setMode(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="chat-card" aria-label="Conversation">
            <div className="chat-header">
              <div>
                <p className="section-kicker">Lab conversation</p>
                <h2>{activeMode.label} mode</h2>
              </div>
              <button type="button" className="text-button" onClick={clearChat} disabled={loading || transcript.length === 0}>
                Clear chat
              </button>
            </div>

            <div className="transcript" aria-live="polite">
              {transcript.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">AI</div>
                  <h3>Start with something from your lab</h3>
                  <p>
                    Try asking why prompt constraints matter, paste a small error for debugging, or ask for a hint on an exercise.
                  </p>
                </div>
              ) : (
                transcript.map((turn) => (
                  <article key={turn.id} className={`message ${turn.role}`}>
                    <div className="message-meta">{turn.role === "user" ? "You" : "Claude lab assistant"}</div>
                    <div className="message-body">{turn.content}</div>
                  </article>
                ))
              )}
              {loading && (
                <div className="thinking" role="status">
                  Claude is working through the lab context…
                </div>
              )}
            </div>

            <form className="composer" onSubmit={handleSubmit}>
              <label htmlFor="lab-message">Your question, code, or prompt</label>
              <textarea
                id="lab-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === "debug"
                    ? "Paste the relevant code or error and tell me what you expected…"
                    : mode === "prompt-coach"
                      ? "Paste the prompt you want to improve…"
                      : "Ask a GenAI lab question…"
                }
                rows={5}
                maxLength={8000}
                disabled={loading}
              />
              <div className="composer-footer">
                <span>Enter to send · Shift+Enter for a new line</span>
                <button type="submit" className="primary-button" disabled={loading || message.trim().length === 0}>
                  {loading ? "Thinking…" : "Ask Claude"}
                </button>
              </div>
            </form>

            <p className="error-message" role="alert" aria-live="assertive">
              {error}
            </p>
          </section>
        </div>

        <aside className="side-column" aria-label="Lab context and guidance">
          <section className="context-card">
            <p className="section-kicker">Active context</p>
            <h2>{source?.label ?? activeTopic.label}</h2>
            <p>
              Responses are grounded in a compact local lab note before Claude adds explanatory guidance.
            </p>
            <div className="source-box">
              <span>Source</span>
              <strong>{source?.sourceLabel ?? `${activeTopic.label} Lab Notes`}</strong>
            </div>
          </section>

          <section className="principles-card">
            <p className="section-kicker">How this tutor behaves</p>
            <ul>
              <li>Uses the selected lab material first.</li>
              <li>States when the supplied context is insufficient.</li>
              <li>Prefers hints and explanations over assignment dumping.</li>
              <li>Keeps your Anthropic API key on the server.</li>
            </ul>
          </section>

          <section className="tip-card">
            <strong>Lab tip</strong>
            <p>For debugging, include the smallest reproducible code snippet and the exact error or unexpected output.</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
