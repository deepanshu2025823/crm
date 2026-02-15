// app/api/edux/public/[id]/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const exam = await db.exam.findUnique({ where: { id } });
  return NextResponse.json(exam);
}