// app/api/dashboard/stats/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [totalLeads, totalUsers, totalExams, results] = await Promise.all([
      db.lead.count(),
      db.user.count(),
      db.exam.count(),
      db.examResult.findMany({ select: { score: true, securityFlags: true } })
    ]);

    const hotLeads = await db.lead.count({ where: { score: { gte: 70 } } });
    const revenueValue = hotLeads * 150;
    const revenueDisplay = revenueValue >= 1000 
      ? `₹${(revenueValue / 1000).toFixed(1)}K` 
      : `₹${revenueValue}`;

    const avgScore = results.length > 0 
      ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
      : 0;

    const cleanExams = results.filter(r => !r.securityFlags || (r.securityFlags as any[]).length === 0).length;
    const integrityRate = results.length > 0 ? Math.round((cleanExams / results.length) * 100) : 100;

    const recentActivity = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return NextResponse.json({
      stats: {
        leads: totalLeads,
        revenue: revenueDisplay,
        exams: totalExams,
        users: totalUsers,
        avgScore: `${avgScore}%`,
        integrity: `${integrityRate}%`
      },
      recentActivity
    });
  } catch (error) {
    return NextResponse.json({ error: "Stats failed" }, { status: 500 });
  }
}