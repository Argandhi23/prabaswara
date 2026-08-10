/**
 * Auto-format Rupiah currency strings for input fields:
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
