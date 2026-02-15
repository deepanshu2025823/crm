// app/api/leads/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, status } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const newLead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        status: status || "NEW",
        sourceDomain: "manual_entry", 
        score: 10, 
      }
    });

    return NextResponse.json(newLead);
  } catch (error) {
    console.error("Create Lead Error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}