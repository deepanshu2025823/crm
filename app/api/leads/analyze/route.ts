// app/api/leads/analyze/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();
    const lead = await db.lead.findUnique({ where: { id: leadId } });

    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Analyze this lead for Career Lab Consulting:
    Name: ${lead.name}
    Email: ${lead.email}
    Based on the email provider and name, determine:
    1. Persona (STUDENT if gmail/outlook, CORPORATE if work email)
    2. Lead Score (0-100 based on conversion probability)
    3. A 1-sentence AI Summary.
    Return ONLY a raw JSON object without markdown formatting: {"persona": "...", "score": 85, "summary": "..."}`;

    const result = await model.generateContent(prompt);
    let textResponse = result.response.text();
    
    const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    const aiResponse = JSON.parse(cleanJson);

    const updatedLead = await db.lead.update({
      where: { id: leadId },
      data: {
        persona: aiResponse.persona,
        score: aiResponse.score,
        aiSummary: aiResponse.summary
      }
    });

    return NextResponse.json(updatedLead);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "AI Analysis failed", details: error.message }, { status: 500 });
  }
}