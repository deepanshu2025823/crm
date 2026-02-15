// app/api/edux/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      include: { results: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, collegeName, timeLimit } = await req.json();

    const newExam = await db.exam.create({
      data: {
        title,
        collegeName,
        timeLimit: parseInt(timeLimit),
        difficulty: "MEDIUM",
        questions: [] 
      }
    });

    return NextResponse.json(newExam);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}