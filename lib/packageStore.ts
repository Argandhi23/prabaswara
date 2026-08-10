import fs from "fs";
import path from "path";
import { PackageData, MOCK_PACKAGES } from "./mockData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "packages.json");

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Reads persisted package items from disk (or MOCK_PACKAGES as fallback)
 */
export function getPersistedPackages(): PackageData[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
export function saveAllPackagesToDisk(packages: PackageData[]) {
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
export function savePersistedPackage(pkgData: any): PackageData {
  const currentPackages = getPersistedPackages();

  const brandTagMap: Record<string, string> = {
    "swara-gallery": "Swara Gallery",
    "swara-studio": "Swara Studio",
    "swara-moment": "Swara Moment",
    "swara-wedding": "Swara Wedding",
  };

  const id = pkgData.id || pkgData._id || `pkg-${Date.now()}`;
  const brandSlug = pkgData.brand_slug || pkgData.brandSlug || "swara-studio";

  const fullPkg: PackageData = {
    _id: id,
    brandSlug,
    brandTag: brandTagMap[brandSlug] || brandSlug,
    name: pkgData.name || "Nama Paket",
    price: pkgData.price || "Rp 0",
    period: pkgData.period || "",
    description: pkgData.description || "",
    features: Array.isArray(pkgData.features) ? pkgData.features : [],
    isPopular: Boolean(pkgData.is_popular !== undefined ? pkgData.is_popular : pkgData.isPopular),
    popularLabel: pkgData.popular_label || pkgData.popularLabel || "PALING POPULER",
    waMessage: pkgData.wa_message || pkgData.waMessage || "",
    order: Number(pkgData.display_order !== undefined ? pkgData.display_order : pkgData.order) || 0,
  };

  const index = currentPackages.findIndex((p) => p._id === id);
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
  const updated = currentPackages.filter((p) => p._id !== id);
  saveAllPackagesToDisk(updated);
}

export { formatRupiahInput } from "./formatters";
