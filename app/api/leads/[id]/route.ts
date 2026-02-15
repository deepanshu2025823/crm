// app/api/leads/[id]/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "ID is missing" }, { status: 400 });
    }

    const lead = await db.lead.findUnique({
      where: {
        id: id, 
      },
      include: {
        communications: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching lead details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}