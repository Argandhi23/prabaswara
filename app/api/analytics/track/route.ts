import { NextRequest, NextResponse } from "next/server";
import {
  recordVisitorLog,
  parseTrafficSource,
  parseBrowserInfo,
  parseDeviceAndOS,
  getFriendlyPageTitle,
} from "@/lib/visitorStore";

function maskIp(ip: string): string {
  const clean = ip.split(",")[0].trim();
  if (!clean || clean === "::1" || clean === "127.0.0.1") {
    return "Lokal (127.0.0.1)";
  }
  if (clean.includes(".")) {
    const parts = clean.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
    }
  }
  if (clean.includes(":")) {
    const parts = clean.split(":");
    return `${parts.slice(0, 3).join(":")}:***`;
  }
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body.path === "string" ? body.path : "/";

    // Never track admin dashboard or API routes
    if (rawPath.startsWith("/admin") || rawPath.startsWith("/api")) {
      return NextResponse.json({ skipped: true });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const uaLower = userAgent.toLowerCase();

    // Ignore automated crawlers/bots
    if (
      uaLower.includes("bot") ||
      uaLower.includes("crawler") ||
      uaLower.includes("spider") ||
      uaLower.includes("lighthouse") ||
      uaLower.includes("headless")
    ) {
      return NextResponse.json({ skipped: true });
    }

    const referrer = typeof body.referrer === "string" ? body.referrer : req.headers.get("referer") || "";
    const utmSource = typeof body.utmSource === "string" ? body.utmSource : "";
    const queryStr = typeof body.queryStr === "string" ? body.queryStr : "";

    const rawCity = req.headers.get("x-vercel-ip-city") || "";
    const rawCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "";
    const city = rawCity ? decodeURIComponent(rawCity) : "";
    const country = rawCountry === "ID" ? "Indonesia" : rawCountry;
    const location = city && country ? `${city}, ${country}` : country || "Indonesia";

    const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const ipMasked = maskIp(forwardedFor);

    const visitorId =
      typeof body.visitorId === "string" && body.visitorId.trim()
        ? body.visitorId.trim()
        : `anon-${ipMasked}`;

    const source = parseTrafficSource(userAgent, referrer, utmSource, queryStr);
    const browser = parseBrowserInfo(userAgent);
    const { os, deviceType } = parseDeviceAndOS(userAgent);
    const pageTitle = getFriendlyPageTitle(rawPath);

    await recordVisitorLog({
      visitor_id: visitorId,
      path: rawPath,
      page_title: pageTitle,
      source,
      referrer,
      browser,
      os,
      device_type: deviceType,
      location,
      ip_masked: ipMasked,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Track failed" }, { status: 500 });
  }
}
