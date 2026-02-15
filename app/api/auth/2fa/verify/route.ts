// app/api/auth/2fa/verify/route.ts

import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    
    const secretPart = user?.name?.split("|2FA:")[1];
    const secret = secretPart?.trim(); 

    if (!secret) return NextResponse.json({ error: "2FA synchronization not initiated" }, { status: 400 });

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32', 
      token: token,
      window: 4 
    });

    if (verified) {
      return NextResponse.json({ 
        success: true, 
        message: "Neural Identity Verified. Guard Active!" 
      });
    } else {
      return NextResponse.json({ 
        error: "Synchronization mismatch. Please refresh your app code and try again." 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json({ error: "Manee Core verification failure" }, { status: 500 });
  }
}