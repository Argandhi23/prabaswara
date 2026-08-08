export const DEFAULT_WHATSAPP_NUMBER = "6281234567890"; // Fallback default

export interface WhatsAppLinkOptions {
  number?: string;
  brandSlug?: string;
  brandTitle?: string;
  customMessage?: string;
}

/**
 * Format raw WhatsApp phone number to international wa.me standard format (e.g., 628123...)
 */
export function formatWhatsAppNumber(rawNumber?: string): string {
  if (!rawNumber) return DEFAULT_WHATSAPP_NUMBER;

  // Remove spaces, hyphens, plus signs, brackets
  let cleaned = rawNumber.replace(/[\s\-\+\(\)]/g, "");

  // If starts with 0 (e.g. 0812...), replace with 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Get pre-filled message based on brand slug or title context
 */
export function getWhatsAppMessage(
  brandSlug?: string,
  brandTitle?: string,
  customMessage?: string
): string {
  if (customMessage) return customMessage;

  const normalized = (brandSlug || brandTitle || "").toLowerCase();

  if (normalized.includes("gallery")) {
    return "Halo Prabaswara, saya tertarik dengan koleksi karya di Swara Gallery dan ingin berkonsultasi.";
  }
  if (normalized.includes("studio")) {
    return "Halo Prabaswara, saya ingin melakukan reservasi sesi foto studio di Swara Studio.";
  }
  if (normalized.includes("moment")) {
    return "Halo Prabaswara, saya ingin menanyakan info penawaran dokumentasi acara di Swara Moment.";
  }
  if (normalized.includes("wedding")) {
    return "Halo Prabaswara, saya tertarik dengan paket foto & dokumentasi pernikahan di Swara Wedding.";
  }

  return "Halo Prabaswara, saya ingin berkonsultasi mengenai layanan dan portofolio fotografi Anda.";
}

/**
 * Generate full wa.me link with URL-encoded pre-filled text message
 */
export function generateWhatsAppLink(options: WhatsAppLinkOptions = {}): string {
  const phone = formatWhatsAppNumber(options.number);
  const message = getWhatsAppMessage(
    options.brandSlug,
    options.brandTitle,
    options.customMessage
  );

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
