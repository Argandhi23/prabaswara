import fs from "fs";
import path from "path";
import { SiteSettingsData, MOCK_SITE_SETTINGS } from "./mockData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "site_settings.json");

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Reads persisted site settings from disk (or MOCK_SITE_SETTINGS as fallback)
 */
export function getPersistedSiteSettings(): SiteSettingsData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (parsed && typeof parsed === "object") {
        return {
          ...MOCK_SITE_SETTINGS,
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.warn("Failed to read site_settings.json from disk, using fallback:", err);
  }

  return MOCK_SITE_SETTINGS;
}

/**
 * Saves site settings to disk
 */
export function savePersistedSiteSettings(settingsData: Partial<SiteSettingsData>): SiteSettingsData {
  const current = getPersistedSiteSettings();
  const updated: SiteSettingsData = {
    ...current,
    ...settingsData,
  };

  try {
    ensureDirectoryExists(DATA_FILE_PATH);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write site_settings.json to disk:", err);
  }

  return updated;
}
