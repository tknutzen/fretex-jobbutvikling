import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildAnalyzeSystemPrompt, buildAnalyzeUserPrompt } from "@/utils/prompts";
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

interface AnalyzeRequest {
  messages: Message[];
  phaseKey: string;
  phaseLabel: string;
  difficulty: DifficultyLevel;
  characterLabel: string;
  scenarioDescription: string;
}

interface Pillar {
  id: string;
  label: string;
  description: string;
  score: number;
}

interface AnalysisResult {
  score: number;
  phaseKey: string;
  phaseLabel: string;
  difficulty: DifficultyLevel;
  pillars: Pillar[];
  good: string[];
  improve: string[];
  nextLevel: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Build transcript
    const transcriptLines: string[] = [];
    for (const msg of body.messages) {
      const roleLabel = msg.role === "user" ? "Jobbkonsulent" : `Arbeidsgiver (${body.characterLabel})`;
      transcriptLines.push(`${roleLabel}: ${msg.text}`);
    }
    const transcript = transcriptLines.join("\n");

    const systemPrompt = buildAnalyzeSystemPrompt();
    const userPrompt = buildAnalyzeUserPrompt(
      {
        phaseKey: body.phaseKey,
        phaseLabel: body.phaseLabel,
        difficulty: body.difficulty,
        characterLabel: body.characterLabel,
        scenarioDescription: body.scenarioDescription,
      },
      transcript
    );

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "{}";

    let result: AnalysisResult;
    try {
      const parsed = JSON.parse(content);
      result = {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        phaseKey: body.phaseKey,
        phaseLabel: body.phaseLabel,
        difficulty: body.difficulty,
        pillars: Array.isArray(parsed.pillars) ? parsed.pillars.map((p: Pillar) => ({
          id: p.id || "",
          label: p.label || "",
          description: p.description || "",
          score: Math.max(0, Math.min(100, p.score || 0)),
        })) : [],
        good: Array.isArray(parsed.good) ? parsed.good : [],
        improve: Array.isArray(parsed.improve) ? parsed.improve : [],
        nextLevel: parsed.nextLevel || null,
      };
    } catch {
      result = {
        score: 0,
        phaseKey: body.phaseKey,
        phaseLabel: body.phaseLabel,
        difficulty: body.difficulty,
        pillars: [],
        good: ["Kunne ikke analysere samtalen på grunn av en teknisk feil."],
        improve: ["Prøv igjen eller kontakt support."],
        nextLevel: null,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
