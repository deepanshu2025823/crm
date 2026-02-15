import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const results = await db.examResult.findMany({
      where: { examId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}