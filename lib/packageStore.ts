import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PackageData, MOCK_PACKAGES } from "./mockData";
import { normalizeOptionalPrice } from "./formatters";
import { supabase, isSupabaseConfigured } from "./supabase/client";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "packages.json");
const STORAGE_BUCKET = "prabaswara-media";
const META_FOLDER = "packages-meta";
const META_PREFIX = "op-";

type PersistedPackageData = PackageData & { id?: string };

export interface PackageInputRecord {
  id?: string;
  _id?: string;
  brand_slug?: string;
  brandSlug?: string;
  name?: string;
  price?: string;
  original_price?: string | null;
  originalPrice?: string | null;
  period?: string | null;
  description?: string | null;
  features?: unknown;
  is_popular?: boolean;
  isPopular?: boolean;
  popular_label?: string | null;
  popularLabel?: string | null;
  wa_message?: string | null;
  waMessage?: string | null;
  display_order?: number | string;
  order?: number | string;
}

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function buildPackageFallbackKey(brandSlug?: string, name?: string): string {
  const safeBrand = (brandSlug || "").trim().toLowerCase();
  const safeName = (name || "").trim().toLowerCase();
  if (!safeBrand || !safeName) return "";
  return `${safeBrand}::${safeName}`;
}

/**
 * Reads persisted package items from disk (or MOCK_PACKAGES as fallback)
 */
export function getPersistedPackages(): PersistedPackageData[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as PersistedPackageData[];
      }
    }
  } catch (err) {
    console.warn("Failed to read packages.json from disk, using fallback:", err);
  }

  // Initial seed to disk if not exists
  saveAllPackagesToDisk(MOCK_PACKAGES);
  return MOCK_PACKAGES;
}

/**
 * Saves all package items to disk
 */
export function saveAllPackagesToDisk(packages: PersistedPackageData[]) {
  try {
    ensureDirectoryExists(DATA_FILE_PATH);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(packages, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write packages.json to disk:", err);
  }
}

/**
 * Save or update a single package item
 */
export function savePersistedPackage(pkgData: PackageInputRecord): PersistedPackageData {
  const currentPackages = getPersistedPackages();

  const brandTagMap: Record<string, string> = {
    "swara-gallery": "Swara Gallery",
    "swara-studio": "Swara Studio",
    "swara-moment": "Swara Moment",
    "swara-wedding": "Swara Wedding",
  };

  const id = pkgData.id || pkgData._id || `pkg-${Date.now()}`;
  const brandSlug = pkgData.brand_slug || pkgData.brandSlug || "swara-studio";

  let index = currentPackages.findIndex((p) => p._id === id || p.id === id);
  if (index < 0 && pkgData.name && brandSlug) {
    index = currentPackages.findIndex(
      (p) => p.name === pkgData.name?.trim() && p.brandSlug === brandSlug
    );
  }

  const existingPkg = index >= 0 ? currentPackages[index] : null;
  const hasExplicitOriginalPrice =
    "original_price" in pkgData || "originalPrice" in pkgData;
  const originalPrice = hasExplicitOriginalPrice
    ? normalizeOptionalPrice(pkgData.original_price ?? pkgData.originalPrice)
    : normalizeOptionalPrice(existingPkg?.originalPrice);

  const features = Array.isArray(pkgData.features)
    ? pkgData.features.filter((f): f is string => typeof f === "string")
    : [];

  const fullPkg: PersistedPackageData = {
    _id: id,
    id: id,
    brandSlug,
    brandTag: brandTagMap[brandSlug] || brandSlug,
    name: pkgData.name || "Nama Paket",
    price: pkgData.price || "Rp 0",
    ...(originalPrice ? { originalPrice } : {}),
    period: pkgData.period || "",
    description: pkgData.description || "",
    features,
    isPopular: Boolean(pkgData.is_popular !== undefined ? pkgData.is_popular : pkgData.isPopular),
    popularLabel: pkgData.popular_label || pkgData.popularLabel || "PALING POPULER",
    waMessage: pkgData.wa_message || pkgData.waMessage || "",
    order: Number(pkgData.display_order !== undefined ? pkgData.display_order : pkgData.order) || 0,
  };

  if (index >= 0) {
    currentPackages[index] = fullPkg;
  } else {
    currentPackages.push(fullPkg);
  }

  saveAllPackagesToDisk(currentPackages);
  return fullPkg;
}

/**
 * Delete a package item by ID
 */
export function deletePersistedPackage(id: string) {
  const currentPackages = getPersistedPackages();
  const updated = currentPackages.filter((p) => p._id !== id && p.id !== id);
  saveAllPackagesToDisk(updated);
}

function buildLocalOriginalPricesMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const localPackages = getPersistedPackages();

  for (const pkg of localPackages) {
    const normalized = normalizeOptionalPrice(pkg.originalPrice);
    if (!normalized) continue;

    if (pkg._id) map[pkg._id] = normalized;
    if (pkg.id) map[pkg.id] = normalized;

    const fallbackKey = buildPackageFallbackKey(pkg.brandSlug, pkg.name);
    if (fallbackKey) map[fallbackKey] = normalized;
  }

  return map;
}

/**
 * Fallback map for original_price when the Supabase `packages` table does not yet have
 * the `original_price` column. Uses Supabase Storage versioned JSON (works on serverless)
 * and falls back to local `data/packages.json`.
 */
export async function getFallbackOriginalPrices(): Promise<Record<string, string>> {
  const localMap = buildLocalOriginalPricesMap();

  if (!isSupabaseConfigured) {
    return localMap;
  }

  try {
    const { data: files, error: listErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(META_FOLDER, {
        limit: 10,
        sortBy: { column: "name", order: "desc" },
      });

    if (listErr || !files || files.length === 0) {
      return localMap;
    }

    const latestFile = files.find(
      (f) => f.name.startsWith(META_PREFIX) && f.name.endsWith(".json")
    );
    if (!latestFile) {
      return localMap;
    }

    const { data: blob } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(`${META_FOLDER}/${latestFile.name}`);

    if (!blob) {
      return localMap;
    }

    const parsed = JSON.parse(await blob.text());
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const sanitized: Record<string, string> = {};
      for (const [key, val] of Object.entries(parsed)) {
        const normalized = normalizeOptionalPrice(typeof val === "string" ? val : "");
        if (normalized) sanitized[key] = normalized;
      }
      return sanitized;
    }
  } catch (err) {
    console.warn("Original price storage fallback read warning:", err);
  }

  return localMap;
}

async function writeFallbackOriginalPricesToStorage(map: Record<string, string>) {
  if (!isSupabaseConfigured) return;

  try {
    const nowMs = Date.now();
    const newFileName = `${META_PREFIX}${nowMs}-${crypto.randomBytes(3).toString("hex")}.json`;
    const payloadBuffer = Buffer.from(JSON.stringify(map));

    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`${META_FOLDER}/${newFileName}`, payloadBuffer, {
        contentType: "application/json",
        cacheControl: "0",
        upsert: false,
      });

    if (!upErr) {
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(META_FOLDER, {
          limit: 20,
          sortBy: { column: "name", order: "desc" },
        });

      if (files && files.length > 2) {
        const oldFiles = files
          .filter((f) => f.name.startsWith(META_PREFIX) && f.name !== newFileName)
          .slice(1)
          .map((f) => `${META_FOLDER}/${f.name}`);

        if (oldFiles.length > 0) {
          await supabase.storage.from(STORAGE_BUCKET).remove(oldFiles);
        }
      }
    }
  } catch (err) {
    console.warn("Original price storage fallback write warning:", err);
  }
}

export async function saveFallbackOriginalPrice(params: {
  id?: string;
  previousId?: string;
  brandSlug?: string;
  name?: string;
  originalPrice?: string | null;
}) {
  const current = { ...(await getFallbackOriginalPrices()) };
  const normalized = normalizeOptionalPrice(params.originalPrice);

  const keys = [
    params.id,
    params.previousId,
    buildPackageFallbackKey(params.brandSlug, params.name),
  ].filter((k): k is string => Boolean(k));

  for (const key of keys) {
    if (normalized) {
      current[key] = normalized;
    } else {
      delete current[key];
    }
  }

  await writeFallbackOriginalPricesToStorage(current);
}

export async function deleteFallbackOriginalPrice(id: string) {
  const current = { ...(await getFallbackOriginalPrices()) };
  if (!(id in current)) return;
  delete current[id];
  await writeFallbackOriginalPricesToStorage(current);
}

export function resolvePackageOriginalPrice(
  row: {
    id?: string;
    _id?: string;
    brand_slug?: string;
    brandSlug?: string;
    name?: string;
    original_price?: string | null;
    originalPrice?: string | null;
  },
  fallbackMap?: Record<string, string>
): string {
  if ("original_price" in row || "originalPrice" in row) {
    return normalizeOptionalPrice(row.original_price ?? row.originalPrice);
  }

  if (!fallbackMap) return "";

  const rowId = row.id || row._id || "";
  if (rowId && fallbackMap[rowId]) {
    return normalizeOptionalPrice(fallbackMap[rowId]);
  }

  const fallbackKey = buildPackageFallbackKey(row.brand_slug || row.brandSlug, row.name);
  if (fallbackKey && fallbackMap[fallbackKey]) {
    return normalizeOptionalPrice(fallbackMap[fallbackKey]);
  }

  return "";
}

export { formatRupiahInput, formatOptionalRupiahInput, normalizeOptionalPrice } from "./formatters";
