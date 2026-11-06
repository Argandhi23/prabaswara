import fs from "fs";
import path from "path";
import crypto from "crypto";
import { supabase, isSupabaseConfigured } from "./supabase/client";
import { VisitorLog, AnalyticsSummary } from "@/types";

const LOCAL_FILE_PATH = path.join(process.cwd(), "data", "visitors.json");
const STORAGE_BUCKET = "prabaswara-media";
const ANALYTICS_FOLDER = "analytics";
const MAX_STORED_LOGS = 3000;

// In-memory cache to reduce storage roundtrips during bursts
let memoryLogsCache: VisitorLog[] | null = null;
let lastCacheSyncMs = 0;

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLocalLogs(): VisitorLog[] {
  try {
    if (fs.existsSync(LOCAL_FILE_PATH)) {
      const raw = fs.readFileSync(LOCAL_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore read error on read-only serverless fs
  }
  return [];
}

function writeLocalLogs(logs: VisitorLog[]) {
  try {
    ensureDirectoryExists(LOCAL_FILE_PATH);
    fs.writeFileSync(LOCAL_FILE_PATH, JSON.stringify(logs, null, 2), "utf-8");
  } catch {
    // ignore write error on read-only serverless fs
  }
}

/**
 * Merge two arrays of VisitorLog by id, sorted newest first
 */
function mergeVisitorLogs(a: VisitorLog[], b: VisitorLog[]): VisitorLog[] {
  const map = new Map<string, VisitorLog>();
  for (const item of a) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of b) {
    if (item && item.id) map.set(item.id, item);
  }
  return Array.from(map.values())
    .sort((x, y) => new Date(y.visited_at).getTime() - new Date(x.visited_at).getTime())
    .slice(0, MAX_STORED_LOGS);
}

/**
 * Fetch visitor logs from Supabase Storage (`analytics/v-*.json`) + local fallback
 */
export async function getVisitorLogs(forceRefresh = false): Promise<VisitorLog[]> {
  const now = Date.now();
  if (!forceRefresh && memoryLogsCache && now - lastCacheSyncMs < 8000) {
    return memoryLogsCache;
  }

  const localLogs = readLocalLogs();

  if (!isSupabaseConfigured) {
    memoryLogsCache = localLogs;
    lastCacheSyncMs = now;
    return localLogs;
  }

  try {
    const { data: files, error: listErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(ANALYTICS_FOLDER, {
        limit: 10,
        sortBy: { column: "name", order: "desc" },
      });

    if (listErr || !files || files.length === 0) {
      memoryLogsCache = localLogs;
      lastCacheSyncMs = now;
      return localLogs;
    }

    const stateFiles = files.filter((f) => f.name.startsWith("v-") && f.name.endsWith(".json"));
    if (stateFiles.length === 0) {
      memoryLogsCache = localLogs;
      lastCacheSyncMs = now;
      return localLogs;
    }

    // Download the newest state file (and second newest if present to prevent any race loss)
    const toDownload = stateFiles.slice(0, 2);
    let combined: VisitorLog[] = [...localLogs];

    for (const fileObj of toDownload) {
      const { data: blob } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(`${ANALYTICS_FOLDER}/${fileObj.name}`);
      if (blob) {
        const text = await blob.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          combined = mergeVisitorLogs(combined, parsed);
        }
      }
    }

    memoryLogsCache = combined;
    lastCacheSyncMs = now;
    writeLocalLogs(combined);
    return combined;
  } catch (err) {
    console.warn("Analytics storage read fallback:", err);
    memoryLogsCache = localLogs;
    lastCacheSyncMs = now;
    return localLogs;
  }
}

/**
 * Record a new visitor log entry safely
 */
export async function recordVisitorLog(entry: Omit<VisitorLog, "id" | "visited_at">): Promise<VisitorLog> {
  const existingLogs = await getVisitorLogs(true);
  const nowMs = Date.now();

  // Deduplicate rapid duplicate pings from same visitor + same path within 30 seconds
  const duplicateRecent = existingLogs.find(
    (log) =>
      log.visitor_id === entry.visitor_id &&
      log.path === entry.path &&
      nowMs - new Date(log.visited_at).getTime() < 30 * 1000
  );

  if (duplicateRecent) {
    return duplicateRecent;
  }

  const newLog: VisitorLog = {
    ...entry,
    id: `vis-${nowMs}-${crypto.randomBytes(3).toString("hex")}`,
    visited_at: new Date(nowMs).toISOString(),
  };

  const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_STORED_LOGS);
  memoryLogsCache = updatedLogs;
  lastCacheSyncMs = nowMs;
  writeLocalLogs(updatedLogs);

  if (isSupabaseConfigured) {
    try {
      const newFileName = `v-${nowMs}-${crypto.randomBytes(3).toString("hex")}.json`;
      const payloadBuffer = Buffer.from(JSON.stringify(updatedLogs));

      // Upload new versioned state file (avoids CDN stale cache & UPDATE RLS limitations)
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`${ANALYTICS_FOLDER}/${newFileName}`, payloadBuffer, {
          contentType: "application/json",
          cacheControl: "0",
          upsert: false,
        });

      if (!upErr) {
        // Clean up older state files in background, keeping the latest 2
        const { data: files } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(ANALYTICS_FOLDER, {
            limit: 20,
            sortBy: { column: "name", order: "desc" },
          });

        if (files && files.length > 2) {
          const oldFiles = files
            .filter((f) => f.name.startsWith("v-") && f.name !== newFileName)
            .slice(1)
            .map((f) => `${ANALYTICS_FOLDER}/${f.name}`);

          if (oldFiles.length > 0) {
            await supabase.storage.from(STORAGE_BUCKET).remove(oldFiles);
          }
        }
      }
    } catch (err) {
      console.warn("Analytics storage write warning:", err);
    }
  }

  return newLog;
}

/**
 * Compute summary statistics for Today (WIB), 7 Days, 30 Days, 1 Year, and All Time
 */
export function buildAnalyticsSummary(logs: VisitorLog[]): AnalyticsSummary {
  const now = new Date();
  // Start of today in WIB (UTC+7)
  const wibOffsetMs = 7 * 60 * 60 * 1000;
  const wibNow = new Date(now.getTime() + wibOffsetMs);
  const startOfTodayWibMs =
    Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - wibOffsetMs;

  const nowMs = now.getTime();
  const weekAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;
  const monthAgoMs = nowMs - 30 * 24 * 60 * 60 * 1000;
  const yearAgoMs = nowMs - 365 * 24 * 60 * 60 * 1000;

  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  let yearCount = 0;

  const uniqueToday = new Set<string>();
  const uniqueWeek = new Set<string>();
  const uniqueMonth = new Set<string>();
  const uniqueYear = new Set<string>();
  const uniqueAll = new Set<string>();

  for (const log of logs) {
    const t = new Date(log.visited_at).getTime();
    const vid = log.visitor_id || log.ip_masked || log.id;
    uniqueAll.add(vid);

    if (t >= startOfTodayWibMs) {
      todayCount++;
      uniqueToday.add(vid);
    }
    if (t >= weekAgoMs) {
      weekCount++;
      uniqueWeek.add(vid);
    }
    if (t >= monthAgoMs) {
      monthCount++;
      uniqueMonth.add(vid);
    }
    if (t >= yearAgoMs) {
      yearCount++;
      uniqueYear.add(vid);
    }
  }

  return {
    counts: {
      today: todayCount,
      week: weekCount,
      month: monthCount,
      year: yearCount,
      all: logs.length,
    },
    uniqueCounts: {
      today: uniqueToday.size,
      week: uniqueWeek.size,
      month: uniqueMonth.size,
      year: uniqueYear.size,
      all: uniqueAll.size,
    },
    logs,
  };
}

/**
 * Parse Traffic Source (Instagram, WhatsApp, TikTok, Google, Facebook, Direct/Chrome, etc.)
 */
export function parseTrafficSource(
  userAgent: string,
  referrer: string,
  utmSource?: string,
  queryStr?: string
): string {
  const ua = (userAgent || "").toLowerCase();
  const ref = (referrer || "").toLowerCase();
  const utm = (utmSource || "").toLowerCase();
  const q = (queryStr || "").toLowerCase();

  // 1. Check explicit UTM or Click IDs first
  if (utm.includes("ig") || utm.includes("instagram") || q.includes("igshid=")) {
    return "Instagram";
  }
  if (utm.includes("wa") || utm.includes("whatsapp")) {
    return "WhatsApp";
  }
  if (utm.includes("tiktok") || utm.includes("tt") || q.includes("ttclid=")) {
    return "TikTok";
  }
  if (utm.includes("fb") || utm.includes("facebook") || q.includes("fbclid=")) {
    return "Facebook";
  }
  if (utm.includes("google") || q.includes("gclid=")) {
    return "Google Search";
  }
  if (utm.includes("youtube") || utm.includes("yt")) {
    return "YouTube";
  }
  if (utm.includes("threads")) {
    return "Threads";
  }

  // 2. Check In-App Browser User-Agent (critical for mobile social apps that strip document.referrer)
  if (ua.includes("instagram")) {
    return "Instagram";
  }
  if (ua.includes("whatsapp")) {
    return "WhatsApp";
  }
  if (ua.includes("tiktok") || ua.includes("musical_ly") || ua.includes("bytedance")) {
    return "TikTok";
  }
  if (ua.includes("fban") || ua.includes("fbav") || ua.includes("fb_iab")) {
    return "Facebook";
  }
  if (ua.includes("barcelona")) {
    return "Threads";
  }
  if (ua.includes("telegram")) {
    return "Telegram";
  }
  if (ua.includes("line/")) {
    return "LINE";
  }

  // 3. Check HTTP Referrer
  if (ref) {
    if (ref.includes("instagram.com") || ref.includes("ig.me")) return "Instagram";
    if (ref.includes("whatsapp.com") || ref.includes("wa.me")) return "WhatsApp";
    if (ref.includes("tiktok.com")) return "TikTok";
    if (ref.includes("facebook.com") || ref.includes("fb.com") || ref.includes("m.facebook.com")) return "Facebook";
    if (ref.includes("google.")) return "Google Search";
    if (ref.includes("youtube.com") || ref.includes("youtu.be")) return "YouTube";
    if (ref.includes("threads.net")) return "Threads";
    if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) return "Twitter / X";
    if (ref.includes("t.me") || ref.includes("telegram.org")) return "Telegram";
    if (ref.includes("bing.com") || ref.includes("yahoo.com") || ref.includes("duckduckgo.com")) {
      return "Mesin Pencari";
    }

    try {
      const url = new URL(referrer);
      if (
        !url.hostname.includes("prabaswara") &&
        !url.hostname.includes("localhost") &&
        !url.hostname.includes("127.0.0.1")
      ) {
        return `Website (${url.hostname.replace(/^www\./, "")})`;
      }
    } catch {
      // ignore invalid referrer URL
    }
  }

  return "Langsung (Browser)";
}

/**
 * Parse Browser name (Instagram App, Chrome, Safari, Edge, Firefox, etc.)
 */
export function parseBrowserInfo(userAgent: string): string {
  const ua = userAgent || "";
  const lower = ua.toLowerCase();

  if (lower.includes("instagram")) return "Instagram Browser";
  if (lower.includes("whatsapp")) return "WhatsApp Browser";
  if (lower.includes("tiktok") || lower.includes("musical_ly") || lower.includes("bytedance")) {
    return "TikTok Browser";
  }
  if (lower.includes("fban") || lower.includes("fbav") || lower.includes("fb_iab")) {
    return "Facebook Browser";
  }
  if (lower.includes("samsungbrowser")) return "Samsung Internet";
  if (lower.includes("edg/") || lower.includes("edga/") || lower.includes("edgios/")) {
    return "Microsoft Edge";
  }
  if (lower.includes("opr/") || lower.includes("opera")) return "Opera";
  if (lower.includes("ucbrowser")) return "UC Browser";
  if (lower.includes("firefox") || lower.includes("fxios")) return "Mozilla Firefox";
  if (lower.includes("crios") || (lower.includes("chrome") && !lower.includes("edg"))) {
    return "Google Chrome";
  }
  if (lower.includes("safari") && !lower.includes("chrome") && !lower.includes("crios")) {
    return "Apple Safari";
  }

  return "Browser Lainnya";
}

/**
 * Parse OS & Device Type
 */
export function parseDeviceAndOS(userAgent: string): {
  os: string;
  deviceType: "mobile" | "desktop" | "tablet";
} {
  const lower = (userAgent || "").toLowerCase();

  if (lower.includes("ipad") || (lower.includes("macintosh") && lower.includes("mobile"))) {
    return { os: "iPad (iPadOS)", deviceType: "tablet" };
  }
  if (lower.includes("iphone") || lower.includes("ipod")) {
    return { os: "iPhone (iOS)", deviceType: "mobile" };
  }
  if (lower.includes("android")) {
    if (lower.includes("mobile")) {
      return { os: "HP Android", deviceType: "mobile" };
    }
    return { os: "Tablet Android", deviceType: "tablet" };
  }
  if (lower.includes("windows")) {
    return { os: "Windows PC/Laptop", deviceType: "desktop" };
  }
  if (lower.includes("macintosh") || lower.includes("mac os x")) {
    return { os: "Mac (macOS)", deviceType: "desktop" };
  }
  if (lower.includes("linux")) {
    return { os: "Linux PC", deviceType: "desktop" };
  }

  return { os: "Perangkat Lainnya", deviceType: "desktop" };
}

/**
 * Map URL pathname to friendly Indonesian page title
 */
export function getFriendlyPageTitle(pathname: string): string {
  const clean = (pathname || "/").split("?")[0];
  switch (clean) {
    case "/":
      return "Beranda Utama";
    case "/swara-gallery":
      return "Swara Gallery";
    case "/swara-studio":
      return "Swara Studio";
    case "/swara-moment":
      return "Swara Moment";
    case "/swara-wedding":
      return "Swara Wedding";
    case "/tentang":
      return "Tentang Kami";
    case "/testimoni":
      return "Testimoni Klien";
    default:
      return clean;
  }
}
