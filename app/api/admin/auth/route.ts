import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, verifyAdminSession, COOKIE_NAME, ADMIN_SECRET } from "@/lib/adminAuth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password wajib diisi" }, { status: 400 });
    }

    // Timing-safe comparison to prevent timing attacks
    const passwordBuffer = Buffer.from(password);
    const secretBuffer = Buffer.from(ADMIN_SECRET);

    if (passwordBuffer.length !== secretBuffer.length || !crypto.timingSafeEqual(passwordBuffer, secretBuffer)) {
      return NextResponse.json({ error: "Password Admin salah!" }, { status: 401 });
    }

    const token = generateAdminToken();

    const response = NextResponse.json({ success: true, message: "Login berhasil" });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function GET() {
  const isAuth = await verifyAdminSession();
  return NextResponse.json({ authenticated: isAuth });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
