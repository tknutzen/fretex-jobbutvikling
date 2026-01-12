import { NextRequest } from "next/server";
import OpenAI from "openai";
import { buildChatSystemPrompt } from "@/utils/prompts";
import { DifficultyLevel } from "@/utils/scenario";

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatRequest {
  messages: Message[];
  employerLabel: string;
  phaseLabel: string;
  difficulty: DifficultyLevel;
  managerName: string;
  scenarioDescription: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.messages || body.messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    if (body.messages.length > 100) {
      return new Response("Too many messages", { status: 400 });
    }

    const systemPrompt = buildChatSystemPrompt({
      employerLabel: body.employerLabel,
      phaseLabel: body.phaseLabel,
      difficulty: body.difficulty,
      managerName: body.managerName,
      scenarioDescription: body.scenarioDescription,
    });

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...body.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.text,
      })),
    ];

    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
