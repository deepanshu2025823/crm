import { NextResponse } from "next/server";
import db from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from "nodemailer";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST() {
  try {
    const pendingLeads = await db.lead.findMany({
      where: { status: "NEW", score: { gte: 50 } },
      take: 5
    });

    if (pendingLeads.length === 0) return NextResponse.json({ message: "No leads require neural follow-up." });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const results = [];

    for (const lead of pendingLeads) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Write a professional short follow-up email for a lead named ${lead.name}. 
      They are interested in ${lead.sourceDomain}. 
      Their lead score is ${lead.score}/100.
      Company: Career Lab Consulting. Tone: Encouraging and industrial.
      Return ONLY the email body.`;

      const aiResponse = await model.generateContent(prompt);
      const emailBody = aiResponse.response.text();

      await transporter.sendMail({
        from: `"Manee AI | Career Lab" <${process.env.SMTP_USER}>`,
        to: lead.email!,
        subject: `Regarding your inquiry for ${lead.sourceDomain}`,
        text: emailBody,
      });

      await db.lead.update({
        where: { id: lead.id },
        data: { status: "HOT" }
      });

      await db.communication.create({
        data: {
          leadId: lead.id,
          type: "EMAIL",
          direction: "OUTBOUND",
          content: emailBody,
          isAutonomous: true
        }
      });

      results.push({ name: lead.name, status: "Contacted" });
    }

    return NextResponse.json({ success: true, processed: results });
  } catch (error: any) {
    console.error("SDR ERROR:", error);
    return NextResponse.json({ error: "SDR Engine Failure" }, { status: 500 });
  }
}