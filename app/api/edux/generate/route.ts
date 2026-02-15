// app/api/edux/generate/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { examId, topic, count, type } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const formatInstruction = type === "MCQ" 
      ? `Return a JSON array of objects: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "..."}]`
      : `Return a JSON array of objects: [{"question": "...", "answer": "..."}]`;

    const prompt = `You are Manee AI, an expert examiner. Generate ${count} high-quality ${type === "MCQ" ? "Multiple Choice Questions" : "Short Answer Questions"} for an exam on the topic: ${topic}. 
    ${formatInstruction}. 
    Return ONLY raw JSON without markdown markers.`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleanJson);

    await db.exam.update({
      where: { id: examId },
      data: { questions: questions }
    });

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    console.error("AI Exam Error:", error);
    return NextResponse.json({ error: "Autonomous Generation Failed", details: error.message }, { status: 500 });
  }
}