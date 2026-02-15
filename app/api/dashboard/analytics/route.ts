import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const analyticsData = await Promise.all(last7Days.map(async (date) => {
      const count = await db.lead.count({
        where: {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });
      const label = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return { name: label, leads: count };
    }));

    return NextResponse.json(analyticsData);
  } catch (error) {
    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
}