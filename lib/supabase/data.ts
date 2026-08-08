import { supabase, isSupabaseConfigured } from "./client";
import {
  BrandData,
  MOCK_BRANDS,
  MOCK_PHOTOS,
  MOCK_SITE_SETTINGS,
  MOCK_TESTIMONIALS,
  PhotoData,
  SiteSettingsData,
  TestimonialData,
} from "@/lib/mockData";

/**
 * Fetch Site Settings with mock fallback
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  if (!isSupabaseConfigured) return MOCK_SITE_SETTINGS;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return MOCK_SITE_SETTINGS;
    }

    return {
      companyName: data.company_name || MOCK_SITE_SETTINGS.companyName,
      tagline: data.tagline || MOCK_SITE_SETTINGS.tagline,
      aboutText: data.about_text || MOCK_SITE_SETTINGS.aboutText,
      whatsappNumber: data.whatsapp_number || MOCK_SITE_SETTINGS.whatsappNumber,
      defaultWhatsappMessage: data.default_whatsapp_message || MOCK_SITE_SETTINGS.defaultWhatsappMessage,
      address: data.address || MOCK_SITE_SETTINGS.address,
      email: data.email || MOCK_SITE_SETTINGS.email,
      instagramUrl: data.instagram_url || MOCK_SITE_SETTINGS.instagramUrl,
      youtubeUrl: data.youtube_url || MOCK_SITE_SETTINGS.youtubeUrl,
      ogImageUrl: data.og_image_url || MOCK_SITE_SETTINGS.ogImageUrl,
      aboutImageUrl: data.about_image_url || MOCK_SITE_SETTINGS.aboutImageUrl,
      cameraImageUrl: data.camera_image_url || MOCK_SITE_SETTINGS.cameraImageUrl,
    };
  } catch (error) {
    console.warn("Error fetching site settings from Supabase:", error);
    return MOCK_SITE_SETTINGS;
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
