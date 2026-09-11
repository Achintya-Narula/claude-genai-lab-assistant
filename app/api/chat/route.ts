import { generateClaudeReply, MissingApiKeyError } from "@/lib/chat/claude";
import { getTopicInfo, loadLabContext } from "@/lib/chat/context";
import { buildSystemPrompt, toClaudeMessages } from "@/lib/chat/prompt";
import { validateChatRequest } from "@/lib/chat/validation";

export const runtime = "nodejs";

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export async function POST(request: Request): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid JSON request body." }, 400);
  }

  const validation = validateChatRequest(input);
  if (!validation.ok) {
    return json({ error: validation.error }, 400);
  }

  const { message, mode, topic, history } = validation.value;

  try {
    const topicInfo = getTopicInfo(topic);
    const context = await loadLabContext(topic);
    const system = buildSystemPrompt({
      mode,
      topicLabel: topicInfo.label,
      context,
    });
    const messages = toClaudeMessages(history, message);
    const reply = await generateClaudeReply({ system, messages });

    return json({ reply, source: topicInfo });
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return json({ error: "Server is missing ANTHROPIC_API_KEY." }, 500);
    }

    console.error("Claude chat request failed", error instanceof Error ? error.name : "UnknownError");
    return json({ error: "Claude is temporarily unavailable. Please try again." }, 502);
  }
}
