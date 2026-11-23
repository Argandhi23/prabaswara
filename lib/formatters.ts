/**
 * Auto-format Rupiah currency strings for required input fields:
 * e.g. "750000" -> "Rp 750.000"
 * "4500000" -> "Rp 4.500.000"
 */
export function formatRupiahInput(value: string): string {
  if (!value) return "Rp ";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Rp ";
  const num = parseInt(digits, 10);
  return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
}

/**
 * Auto-format optional Rupiah currency strings (allows clearing back to empty string):
 * e.g. "1000000" -> "Rp 1.000.000", "" or "Rp " -> ""
 */
export function formatOptionalRupiahInput(value: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (!num) return "";
  return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
}

/**
 * Normalize an optional price string before saving or displaying.
 * Strips blank or placeholder values like "Rp " or "Rp 0" down to "".
 */
export function normalizeOptionalPrice(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (!digits || parseInt(digits, 10) <= 0) return "";
  return trimmed;
}

/**
 * Parse a formatted Rupiah string (e.g. "Rp 1.250.000") into a positive integer.
 * Returns null if blank, invalid, or <= 0.
 */
export function parseRupiahToNumber(value?: string | null): number | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  const parsed = parseInt(digits, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

/**
 * Calculate rounded integer discount percentage from strikethrough original price to active price.
 * Returns null if original price is missing, invalid, or not strictly greater than current price.
 */
export function calculateDiscountPercentage(
  originalPrice?: string | null,
  currentPrice?: string | null
): number | null {
  const original = parseRupiahToNumber(originalPrice);
  const current = parseRupiahToNumber(currentPrice);

  if (!original || !current || original <= current) {
    return null;
  }

  const percent = Math.round(((original - current) / original) * 100);
  return percent > 0 ? percent : null;
}
