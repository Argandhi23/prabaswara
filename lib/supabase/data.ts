import { supabase, isSupabaseConfigured } from "./client";
import {
  BrandData,
  MOCK_BRANDS,
  MOCK_PHOTOS,
  MOCK_SITE_SETTINGS,
  MOCK_TESTIMONIALS,
  PackageData,
  PhotoData,
  SiteSettingsData,
  TestimonialData,
} from "@/lib/mockData";
import { getPersistedPackages } from "@/lib/packageStore";
import { getPersistedSiteSettings } from "@/lib/siteSettingsStore";

/**
 * Fetch Site Settings with mock/disk fallback
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const localSettings = getPersistedSiteSettings();

  if (!isSupabaseConfigured) return localSettings;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return localSettings;
    }

    return {
      companyName: data.company_name || localSettings.companyName,
      tagline: data.tagline || localSettings.tagline,
      aboutText: data.about_text || localSettings.aboutText,
      whatsappNumber: data.whatsapp_number || localSettings.whatsappNumber,
      defaultWhatsappMessage: data.default_whatsapp_message || localSettings.defaultWhatsappMessage,
      address: data.address || localSettings.address,
      email: data.email || localSettings.email,
      instagramUrl: data.instagram_url || localSettings.instagramUrl,
      youtubeUrl: data.youtube_url || localSettings.youtubeUrl,
      ogImageUrl: data.og_image_url || localSettings.ogImageUrl,
      aboutImageUrl: data.about_image_url || localSettings.aboutImageUrl,
      cameraImageUrl: data.camera_image_url || localSettings.cameraImageUrl,
    };
  } catch (error) {
    console.warn("Error fetching site settings from Supabase:", error);
    return localSettings;
  }
}

/**
 * Fetch all sub-brands with mock fallback
 */
export async function getBrands(): Promise<BrandData[]> {
  if (!isSupabaseConfigured) return MOCK_BRANDS;

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_BRANDS;
    }

    return data.map((b) => ({
      _id: b.id,
      title: b.title,
      slug: b.slug,
      tagline: b.tagline || "",
      description: b.description || "",
      coverImage: b.cover_image,
      whatsappMessage: b.whatsapp_message || "",
      order: b.display_order || 0,
    }));
  } catch (error) {
    console.warn("Error fetching brands from Supabase:", error);
    return MOCK_BRANDS;
  }
}

/**
 * Fetch brand by slug with mock fallback
 */
export async function getBrandBySlug(slug: string): Promise<BrandData | null> {
  if (!isSupabaseConfigured) {
    return MOCK_BRANDS.find((b) => b.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return MOCK_BRANDS.find((b) => b.slug === slug) || null;
    }

    return {
      _id: data.id,
      title: data.title,
      slug: data.slug,
      tagline: data.tagline || "",
      description: data.description || "",
      coverImage: data.cover_image,
      whatsappMessage: data.whatsapp_message || "",
      order: data.display_order || 0,
    };
  } catch (error) {
    console.warn(`Error fetching brand ${slug} from Supabase:`, error);
    return MOCK_BRANDS.find((b) => b.slug === slug) || null;
  }
}

/**
 * Fetch featured photos for Homepage
 */
export async function getFeaturedPhotos(): Promise<PhotoData[]> {
  if (!isSupabaseConfigured) {
    return MOCK_PHOTOS.filter((p) => p.isFeatured);
  }

  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("is_featured", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_PHOTOS.filter((p) => p.isFeatured);
    }

    return data.map((p) => ({
      _id: p.id,
      title: p.title,
      imageUrl: p.image_url,
      caption: p.caption || "",
      brandSlug: p.brand_slug || "",
      brandTitle: p.brand_title || "",
      isFeatured: p.is_featured,
      aspectRatio: (p.aspect_ratio as "portrait" | "landscape" | "square") || "portrait",
      order: p.display_order || 0,
    }));
  } catch (error) {
    console.warn("Error fetching featured photos from Supabase:", error);
    return MOCK_PHOTOS.filter((p) => p.isFeatured);
  }
}

/**
 * Fetch all photos or by brand
 */
export async function getPhotosByBrand(slug?: string): Promise<PhotoData[]> {
  if (!isSupabaseConfigured) {
    if (!slug) return MOCK_PHOTOS;
    return MOCK_PHOTOS.filter((p) => p.brandSlug === slug);
  }

  try {
    let query = supabase.from("photos").select("*").order("display_order", { ascending: true });
    if (slug) {
      query = query.eq("brand_slug", slug);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (!slug) return MOCK_PHOTOS;
      return MOCK_PHOTOS.filter((p) => p.brandSlug === slug);
    }

    return data.map((p) => ({
      _id: p.id,
      title: p.title,
      imageUrl: p.image_url,
      caption: p.caption || "",
      brandSlug: p.brand_slug || "",
      brandTitle: p.brand_title || "",
      isFeatured: p.is_featured,
      aspectRatio: (p.aspect_ratio as "portrait" | "landscape" | "square") || "portrait",
      order: p.display_order || 0,
    }));
  } catch (error) {
    console.warn("Error fetching photos from Supabase:", error);
    if (!slug) return MOCK_PHOTOS;
    return MOCK_PHOTOS.filter((p) => p.brandSlug === slug);
  }
}

/**
 * Fetch testimonials with optional brand filter
 */
export async function getTestimonials(brandSlug?: string): Promise<TestimonialData[]> {
  if (!isSupabaseConfigured) {
    if (!brandSlug) return MOCK_TESTIMONIALS;
    return MOCK_TESTIMONIALS.filter((t) => t.brandSlug === brandSlug);
  }

  try {
    let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (brandSlug) {
      query = query.eq("brand_slug", brandSlug);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (!brandSlug) return MOCK_TESTIMONIALS;
      return MOCK_TESTIMONIALS.filter((t) => t.brandSlug === brandSlug);
    }

    return data.map((t) => ({
      _id: t.id,
      clientName: t.client_name,
      roleOrEvent: t.role_or_event || "",
      quote: t.quote,
      avatarUrl: t.avatar_url || "",
      rating: t.rating || 5,
      brandSlug: t.brand_slug || "",
    }));
  } catch (error) {
    console.warn("Error fetching testimonials from Supabase:", error);
    if (!brandSlug) return MOCK_TESTIMONIALS;
    return MOCK_TESTIMONIALS.filter((t) => t.brandSlug === brandSlug);
  }
}

/**
 * Fetch pricing packages with optional brand filter (Supabase primary, disk fallback)
 */
export async function getPackages(brandSlug?: string): Promise<PackageData[]> {
  const localPackages = getPersistedPackages();

  if (!isSupabaseConfigured) {
    if (!brandSlug) return localPackages;
    return localPackages.filter((p) => p.brandSlug === brandSlug);
  }

  try {
    let query = supabase.from("packages").select("*").order("display_order", { ascending: true });
    if (brandSlug) {
      query = query.eq("brand_slug", brandSlug);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (!brandSlug) return localPackages;
      return localPackages.filter((p) => p.brandSlug === brandSlug);
    }

    const brandMap: Record<string, string> = {
      "swara-gallery": "Swara Gallery",
      "swara-studio": "Swara Studio",
      "swara-moment": "Swara Moment",
      "swara-wedding": "Swara Wedding",
    };

    return data.map((p) => ({
      _id: p.id,
      brandSlug: p.brand_slug,
      brandTag: brandMap[p.brand_slug] || p.brand_slug,
      name: p.name,
      price: p.price,
      period: p.period || "",
      description: p.description || "",
      features: Array.isArray(p.features) ? p.features : [],
      isPopular: Boolean(p.is_popular),
      popularLabel: p.popular_label || "PALING POPULER",
      waMessage: p.wa_message || "",
      order: p.display_order || 0,
    }));
  } catch (error) {
    console.warn("Error fetching packages from Supabase:", error);
    if (!brandSlug) return localPackages;
    return localPackages.filter((p) => p.brandSlug === brandSlug);
  }
}
