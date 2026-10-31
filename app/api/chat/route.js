import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTIONS = `
You are a helpful, clear, and respectful AI assistant.
Answer the user's question directly and accurately.
If you are uncertain, say so rather than inventing facts.
Use readable formatting when it improves the answer.
Do not claim to have performed actions you cannot perform.
`;

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "The chatbot is not configured yet. Add OPENAI_API_KEY in your Vercel environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const incoming = body?.messages;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: "Please send a message." }, { status: 400 });
    }

    // Keep only a small, validated conversation history to control request size.
    const messages = incoming
      .filter((item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
      )
      .slice(-20)
      .map((item) => ({
        role: item.role,
        content: item.content.trim().slice(0, 6000)
      }))
      .filter((item) => item.content.length > 0);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Your latest message must be a user message." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_INSTRUCTIONS,
      input: messages,
      max_output_tokens: 800
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      return NextResponse.json({ error: "The AI returned an empty response. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "The AI service is busy or your API usage limit has been reached. Please try again later." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Unable to get a response right now. Check your API key and model settings, then try again." },
      { status: 500 }
    );
  }
}
