// app/api/edux/analyze-result/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { resultId } = await req.json();
    const result = await db.examResult.findUnique({
      where: { id: resultId },
      include: { exam: true }
    });

    if (!result) return NextResponse.json({ error: "Result not found" }, { status: 404 });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Analyze this student's exam performance and integrity for Career Lab Consulting:
    Student Name: ${result.studentName}
    Final AI Score: ${result.score}%
    Security Flags (Tab Switches): ${JSON.stringify(result.securityFlags)}
    Assessment Title: ${result.exam.title}
    
    Provide a professional behavioral audit (max 2 sentences). 
    If score is high (>80) and 0 violations, be highly appreciative. 
    If violations exist, maintain a firm professional tone regarding integrity violations.
    Return ONLY raw string text without markdown.`;

    const aiResult = await model.generateContent(prompt);
    const auditText = aiResult.response.text().trim();

    await db.examResult.update({
      where: { id: resultId },
      data: { deviceInfo: auditText } 
    });

    return NextResponse.json({ success: true, audit: auditText });
  } catch (error: any) {
    console.error("MANEE AUDIT ERROR:", error);
    
    if (error.status === 429) {
      return NextResponse.json({ 
        error: "Quota Exceeded", 
        audit: "Namaste! Manee's neural pathways are full. Please wait 1 minute before re-auditing." 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: "Manee Audit Failed", 
      details: error.message 
    }, { status: 500 });
  }
}