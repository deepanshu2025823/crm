// app/api/edux/submit/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { examId, studentName, email, whatsapp, answers, flags } = await req.json();
    const exam = await db.exam.findUnique({ where: { id: examId } });
    if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    let score = 0;
    const questions = exam.questions as any[];
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) score += 1;
    });
    const finalScore = Math.round((score / questions.length) * 100);

    const result = await db.examResult.create({
      data: {
        examId, studentName, email, whatsapp,
        score: finalScore,
        status: finalScore >= 50 ? "PASSED" : "FAILED",
        securityFlags: flags,
      }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER as string, pass: process.env.SMTP_PASS as string },
    });

    await transporter.sendMail({
      from: `"EduX Academy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Result: ${exam.title} - Career Lab Consulting`,
      text: `Namaste ${studentName},\n\nYou have completed your assessment. Your Manee AI score is ${finalScore}%.\n\nThank you for choosing CLC.`,
    });

    return NextResponse.json({ success: true, score: finalScore });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}