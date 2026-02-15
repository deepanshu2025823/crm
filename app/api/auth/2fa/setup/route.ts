// app/api/auth/2fa/setup/route.ts

import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Career Lab OS (${session.user.email})`,
      issuer: "Career Lab Consulting"
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || "");

    const currentName = session.user.name?.split("|2FA:")[0].trim() || session.user.name;
    
    await db.user.update({
      where: { email: session.user.email },
      data: { name: `${currentName}|2FA:${secret.base32}` } 
    });

    return NextResponse.json({ success: true, qrCode: qrCodeDataUrl });
  } catch (error: any) {
    console.error("2FA SETUP ERROR:", error);
    return NextResponse.json({ error: "Neural Sync Failed" }, { status: 500 });
  }
}