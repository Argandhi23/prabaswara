"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    try {
      let visitorId = localStorage.getItem("prabaswara_vid");
      if (!visitorId) {
        visitorId = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("prabaswara_vid", visitorId);
      }

      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(search);
      const currentUtm =
        params.get("utm_source") || params.get("ref") || params.get("source") || "";

      // Preserve external referrer & UTM across internal page navigations in the same session
      let sessionRef = sessionStorage.getItem("prabaswara_ref") || "";
      if (!sessionRef && document.referrer && !document.referrer.includes(window.location.host)) {
        sessionRef = document.referrer;
        sessionStorage.setItem("prabaswara_ref", sessionRef);
      }

      let sessionUtm = sessionStorage.getItem("prabaswara_utm") || "";
      if (currentUtm) {
        sessionUtm = currentUtm;
        sessionStorage.setItem("prabaswara_utm", sessionUtm);
      }

      let sessionQuery = sessionStorage.getItem("prabaswara_query") || "";
      if (search) {
        sessionQuery = search;
        sessionStorage.setItem("prabaswara_query", sessionQuery);
      }

      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: sessionRef || document.referrer || "",
          visitorId,
          utmSource: sessionUtm,
          queryStr: sessionQuery || search,
        }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore network errors on client tracking
      });
    } catch {
      // Ignore storage access errors in strict privacy modes
    }
  }, [pathname]);

  return null;
}
