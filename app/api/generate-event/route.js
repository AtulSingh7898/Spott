import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
Return ONLY valid JSON:
{
  "title": "",
  "description": "",
  "category": "",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}
Event idea: ${prompt}
`;

    let result;

    try {
      // 🚨 This is where 429 is thrown
      result = await model.generateContent(systemPrompt);
    } catch (err) {
      console.error("Gemini generateContent error:", err);

      // ✅ Rate limit handling
      if (err?.status === 429) {
        const retryDelay =
          err?.errorDetails?.find(d => d["@type"]?.includes("RetryInfo"))
            ?.retryDelay || "20s";

        return NextResponse.json(
          {
            error: "Gemini rate limit exceeded. Please wait and retry.",
            retryAfter: retryDelay,
          },
          { status: 429 }
        );
      }

      throw err; // rethrow non-429 errors
    }

    const text = result.response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const eventData = JSON.parse(cleanedText);

    return NextResponse.json(eventData);

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to generate event" },
      { status: 500 }
    );
  }
}
