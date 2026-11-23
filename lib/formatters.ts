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
