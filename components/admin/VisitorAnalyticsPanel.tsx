"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Clock,
  MapPin,
  Compass,
  Share2,
  FileText,
} from "lucide-react";
import { AnalyticsSummary, VisitorLog } from "@/types";

type PeriodKey = "today" | "week" | "month" | "year" | "all";

interface VisitorAnalyticsPanelProps {
  summary: AnalyticsSummary;
  onRefresh: () => void;
  refreshing?: boolean;
}

const PERIOD_LABELS: { key: PeriodKey; title: string; subtitle: string }[] = [
  { key: "today", title: "Hari Ini", subtitle: "Sejak 00:00 WIB" },
  { key: "week", title: "1 Minggu Ini", subtitle: "7 hari terakhir" },
  { key: "month", title: "Sebulan Ini", subtitle: "30 hari terakhir" },
  { key: "year", title: "Setahun Ini", subtitle: "365 hari terakhir" },
  { key: "all", title: "Semuanya", subtitle: "Total keseluruhan" },
];

function formatRelativeTime(isoDate: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatWibDateTime(isoDate: string): string {
  try {
    return (
      new Date(isoDate).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  } catch {
    return isoDate;
  }
}

function getSourceBadgeClass(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("instagram")) {
    return "bg-pink-950/60 text-pink-300 border-pink-700/60";
  }
  if (s.includes("whatsapp")) {
    return "bg-emerald-950/60 text-emerald-300 border-emerald-700/60";
  }
  if (s.includes("tiktok")) {
    return "bg-cyan-950/60 text-cyan-300 border-cyan-700/60";
  }
  if (s.includes("google")) {
    return "bg-amber-950/60 text-amber-300 border-amber-700/60";
  }
  if (s.includes("facebook")) {
    return "bg-blue-950/60 text-blue-300 border-blue-700/60";
  }
  return "bg-neutral-800 text-neutral-200 border-neutral-700";
}

function getShortVisitorLabel(visitorId: string): string {
  if (!visitorId) return "Tamu";
  const clean = visitorId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `#${clean.slice(-5) || "TAMU"}`;
}

export default function VisitorAnalyticsPanel({
  summary,
  onRefresh,
  refreshing = false,
}: VisitorAnalyticsPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("today");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [visibleLimit, setVisibleLimit] = useState<number>(30);

  // Filter logs by selected period
  const periodFilteredLogs = useMemo(() => {
    const now = new Date();
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const wibNow = new Date(now.getTime() + wibOffsetMs);
    const startOfTodayWibMs =
      Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - wibOffsetMs;

    const nowMs = now.getTime();
    let cutoffMs = 0;

    if (selectedPeriod === "today") cutoffMs = startOfTodayWibMs;
    else if (selectedPeriod === "week") cutoffMs = nowMs - 7 * 24 * 60 * 60 * 1000;
    else if (selectedPeriod === "month") cutoffMs = nowMs - 30 * 24 * 60 * 60 * 1000;
    else if (selectedPeriod === "year") cutoffMs = nowMs - 365 * 24 * 60 * 60 * 1000;
    else cutoffMs = 0;

    return summary.logs.filter((log) => new Date(log.visited_at).getTime() >= cutoffMs);
  }, [summary.logs, selectedPeriod]);

  // Compute breakdowns for the selected period
  const breakdowns = useMemo(() => {
    const sourcesMap = new Map<string, number>();
    const browsersMap = new Map<string, number>();
    const devicesMap = new Map<string, number>();
    const pagesMap = new Map<string, number>();

    for (const log of periodFilteredLogs) {
      const src = log.source || "Langsung (Browser)";
      sourcesMap.set(src, (sourcesMap.get(src) || 0) + 1);

      const br = log.browser || "Browser Lainnya";
      browsersMap.set(br, (browsersMap.get(br) || 0) + 1);

      const dev = log.os || "Perangkat Lainnya";
      devicesMap.set(dev, (devicesMap.get(dev) || 0) + 1);

      const pg = log.page_title || log.path || "Beranda Utama";
      pagesMap.set(pg, (pagesMap.get(pg) || 0) + 1);
    }

    const toSortedList = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([name, count]) => ({
          name,
          count,
          percent:
            periodFilteredLogs.length > 0
              ? Math.round((count / periodFilteredLogs.length) * 100)
              : 0,
        }))
        .sort((a, b) => b.count - a.count);

    return {
      sources: toSortedList(sourcesMap),
      browsers: toSortedList(browsersMap),
      devices: toSortedList(devicesMap),
      pages: toSortedList(pagesMap),
    };
  }, [periodFilteredLogs]);

  const availableSources = useMemo(() => {
    const s = new Set<string>();
    for (const log of summary.logs) {
      if (log.source) s.add(log.source);
    }
    return Array.from(s);
  }, [summary.logs]);

  const tableLogs = useMemo(() => {
    if (sourceFilter === "all") return periodFilteredLogs;
    return periodFilteredLogs.filter((l) => l.source === sourceFilter);
  }, [periodFilteredLogs, sourceFilter]);

  const activePeriodObj =
    PERIOD_LABELS.find((p) => p.key === selectedPeriod) || PERIOD_LABELS[0];

  return (
    <div className="space-y-6">
      {/* Top Summary Cards: Hari Ini, 1 Minggu, Sebulan, Setahun, Semuanya */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {PERIOD_LABELS.map((period) => {
          const isSelected = selectedPeriod === period.key;
          const totalViews = summary.counts[period.key] || 0;
          const uniqueVisitors = summary.uniqueCounts[period.key] || 0;

          return (
            <button
              key={period.key}
              onClick={() => {
                setSelectedPeriod(period.key);
                setVisibleLimit(30);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#C9A961]/15 border-[#C9A961] shadow-lg shadow-[#C9A961]/10"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isSelected ? "text-[#C9A961]" : "text-neutral-300"
                  }`}
                >
                  {period.title}
                </span>
                <span className="text-[10px] text-neutral-500">{period.subtitle}</span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
                  {totalViews.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-neutral-400">kunjungan</span>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Users className="w-3.5 h-3.5 text-[#C9A961]" />
                <span>
                  <strong className="text-neutral-200">
                    {uniqueVisitors.toLocaleString("id-ID")}
                  </strong>{" "}
                  pengunjung unik
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Bar & Refresh */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-neutral-400 font-medium mr-1.5">Rentang Waktu:</span>
          {PERIOD_LABELS.map((period) => (
            <button
              key={period.key}
              onClick={() => {
                setSelectedPeriod(period.key);
                setVisibleLimit(30);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedPeriod === period.key
                  ? "bg-[#C9A961] text-neutral-950 font-bold"
                  : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
              }`}
            >
              {period.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-[#C9A961]"
          >
            <option value="all">Semua Sumber Asal</option>
            {availableSources.map((src) => (
              <option key={src} value={src}>
                Dari: {src}
              </option>
            ))}
          </select>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C9A961] ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 3 Breakdown Cards: Asal Trafik (IG, WA, Google, dll), Browser (Chrome, Safari, IG), Perangkat & Halaman */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Sumber Kunjungan (Dari Mana) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#C9A961]" />
              <span>Dikunjungi Dari Mana ({activePeriodObj.title})</span>
            </h3>
          </div>

          {breakdowns.sources.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">
              Belum ada data kunjungan pada periode {activePeriodObj.title.toLowerCase()}.
            </p>
          ) : (
            <div className="space-y-3">
              {breakdowns.sources.slice(0, 6).map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-[#C9A961] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Browser yang Digunakan */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9A961]" />
              <span>Browser Pengunjung ({activePeriodObj.title})</span>
            </h3>
          </div>

          {breakdowns.browsers.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">
              Belum ada data browser pada periode ini.
            </p>
          ) : (
            <div className="space-y-3">
              {breakdowns.browsers.slice(0, 6).map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-emerald-400/80 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Perangkat & Halaman Populer */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A961]" />
              <span>Halaman & Perangkat ({activePeriodObj.title})</span>
            </h3>
          </div>

          {breakdowns.pages.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">
              Belum ada halaman yang dikunjungi pada periode ini.
            </p>
          ) : (
            <div className="space-y-3">
              {breakdowns.pages.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/70 last:border-none">
                  <span className="text-neutral-200 font-medium truncate pr-2">{item.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[#C9A961] font-mono text-[11px] shrink-0">
                    {item.count}x dibuka
                  </span>
                </div>
              ))}

              {breakdowns.devices.length > 0 && (
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">
                    Perangkat Pengunjung:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {breakdowns.devices.map((dev) => (
                      <span
                        key={dev.name}
                        className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300"
                      >
                        {dev.name}: <strong className="text-[#C9A961]">{dev.count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Visitor Log Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif-heading text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C9A961]" />
              <span>Riwayat Siapa yang Mengunjungi Website ({activePeriodObj.title})</span>
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Menampilkan daftar pengunjung beserta asal klik (Instagram, Google, WA, Browser), perangkat, dan waktu kunjungan.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono shrink-0">
            Total: <strong className="text-[#C9A961]">{tableLogs.length}</strong> kunjungan
          </span>
        </div>

        {tableLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Globe className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-400 font-medium">
              Belum ada riwayat pengunjung untuk filter ini.
            </p>
            <p className="text-xs text-neutral-500">
              Setiap pengunjung yang membuka website dari Instagram, Chrome, Safari, WhatsApp, dll akan langsung tercatat otomatis di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4">Pengunjung & Lokasi</th>
                  <th className="py-3.5 px-4">Asal Kunjungan</th>
                  <th className="py-3.5 px-4">Browser & Perangkat</th>
                  <th className="py-3.5 px-4">Halaman Dibuka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70 text-xs">
                {tableLogs.slice(0, visibleLimit).map((log: VisitorLog) => {
                  const DeviceIcon =
                    log.device_type === "mobile"
                      ? Smartphone
                      : log.device_type === "tablet"
                      ? Tablet
                      : Monitor;

                  return (
                    <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C9A961]" />
                          <span>{formatRelativeTime(log.visited_at)}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {formatWibDateTime(log.visited_at)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[#C9A961] font-mono text-[11px]">
                            Pengunjung {getShortVisitorLabel(log.visitor_id)}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-neutral-500" />
                          <span>{log.location || "Indonesia"}</span>
                          {log.ip_masked && (
                            <span className="text-neutral-600 font-mono">• {log.ip_masked}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getSourceBadgeClass(
                            log.source
                          )}`}
                        >
                          {log.source || "Langsung (Browser)"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-200">{log.browser}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <DeviceIcon className="w-3 h-3 text-[#C9A961]" />
                          <span>{log.os}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{log.page_title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{log.path}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tableLogs.length > visibleLimit && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 text-center">
            <button
              onClick={() => setVisibleLimit((prev) => prev + 30)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
            >
              Tampilkan Lebih Banyak ({tableLogs.length - visibleLimit} lainnya)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
