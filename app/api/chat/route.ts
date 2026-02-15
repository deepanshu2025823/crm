// app/api/chat/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import db from "@/lib/db"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    const [exams, leads] = await Promise.all([
      db.exam.findMany({ select: { id: true, title: true, collegeName: true } }),
      db.lead.findMany({ select: { id: true, name: true, email: true }, take: 5 })
    ]);

    const examDataString = exams.length > 0 
      ? exams.map(e => `ID: ${e.id} | Name: ${e.title} | Client: ${e.collegeName}`).join("\n")
      : "No active exams found.";

    const leadDataString = leads.length > 0
      ? leads.map(l => `ID: ${l.id} | Name: ${l.name}`).join("\n")
      : "No leads found.";

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
    });

    const isInternshipPage = context === "internship";
    
    const systemPrompt = `
    You are Manee, an Enterprise AI Consultant at Career Lab Consulting. 
    You have direct neural access to the live database. Use this data only if the user asks for specific IDs or records.

    --- DATABASE SNAPSHOT ---
    ACTIVE EXAMS:
    ${examDataString}

    RECENT LEADS:
    ${leadDataString}
    ---------------------------

    TONE: Warm, professional, Indian female counselor. 
    RULES:
    - If a user asks for "exam IDs", list the IDs clearly from the data provided.
    - Confirm the 10% Early Bird discount is active today.
    - Gurugram is the Global HQ.
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Namaste! I am Manee. My neural links to the database are fully synchronized. How can I assist you with your exam IDs or leads today?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error: any) {
    console.error("AI Error:", error);
    
    if (error.status === 429) {
       return NextResponse.json({ 
         reply: "Namaste! Mere neural pathways thode busy hain (Quota Full). Please wait 1 minute." 
       }, { status: 429 });
    }

    return NextResponse.json({ reply: "Neural sync issue. Check if DATABASE_URL and GEMINI_API_KEY are correct." }, { status: 500 });
  }
}