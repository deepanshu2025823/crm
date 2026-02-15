import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import db from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();
    const lead = await db.lead.findUnique({ where: { id: leadId } });

    if (!lead || !lead.email) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are Manee, an AI SDR for Career Lab Consulting. 
    Write a short, professional, and friendly follow-up email to a lead named ${lead.name}. 
    Status: ${lead.status}. 
    Tone: Helpful and Enterprise-grade. 
    Keep it under 100 words. Mention that we are ready to help with their transformation.`;

    const result = await model.generateContent(prompt);
    const aiMessage = result.response.text();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    await transporter.sendMail({
      from: `"Manee AI (Career Lab Consulting)" <${process.env.SMTP_USER}>`,
      to: lead.email,
      subject: `Career Lab Follow-up for ${lead.name}`,
      text: aiMessage,
    });

    await db.communication.create({
      data: {
        leadId: lead.id,
        type: "EMAIL",
        direction: "OUTBOUND",
        content: aiMessage,
        isAutonomous: true,
      }
    });

    return NextResponse.json({ success: true, aiGeneratedMessage: aiMessage });
  } catch (error: any) {
    console.error("AI SDR ERROR:", error);
    return NextResponse.json({ error: "AI Follow-up failed", details: error.message }, { status: 500 });
  }
}