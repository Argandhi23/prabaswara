import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { getVisitorLogs, buildAnalyticsSummary } from "@/lib/visitorStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await getVisitorLogs(true);
    const summary = buildAnalyticsSummary(logs);

    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal memuat statistik pengunjung" },
      { status: 500 }
    );
  }
}
