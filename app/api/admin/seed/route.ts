import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";
import { MOCK_BRANDS, MOCK_PHOTOS, MOCK_TESTIMONIALS, MOCK_SITE_SETTINGS, MOCK_PACKAGES } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Seed Site Settings if empty
    const { data: existingSettings } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
    if (!existingSettings) {
      await supabase.from("site_settings").insert([
        {
          company_name: MOCK_SITE_SETTINGS.companyName,
          tagline: MOCK_SITE_SETTINGS.tagline,
          about_text: MOCK_SITE_SETTINGS.aboutText,
          whatsapp_number: MOCK_SITE_SETTINGS.whatsappNumber,
          default_whatsapp_message: MOCK_SITE_SETTINGS.defaultWhatsappMessage,
          address: MOCK_SITE_SETTINGS.address,
          email: MOCK_SITE_SETTINGS.email,
          instagram_url: MOCK_SITE_SETTINGS.instagramUrl,
          youtube_url: MOCK_SITE_SETTINGS.youtubeUrl,
          og_image_url: MOCK_SITE_SETTINGS.ogImageUrl,
        },
      ]);
    }

    // 2. Seed Brands if empty
    const { data: existingBrands } = await supabase.from("brands").select("id").limit(1);
    if (!existingBrands || existingBrands.length === 0) {
      const brandsPayload = MOCK_BRANDS.map((b) => ({
        title: b.title,
        slug: b.slug,
        tagline: b.tagline,
        description: b.description,
        cover_image: b.coverImage,
        whatsapp_message: b.whatsappMessage,
        display_order: b.order,
      }));
      await supabase.from("brands").insert(brandsPayload);
    }

    // 3. Seed Photos if empty
    const { data: existingPhotos } = await supabase.from("photos").select("id").limit(1);
    if (!existingPhotos || existingPhotos.length === 0) {
      const photosPayload = MOCK_PHOTOS.map((p) => ({
        title: p.title,
        image_url: p.imageUrl,
        caption: p.caption,
        brand_slug: p.brandSlug,
        brand_title: p.brandTitle,
        is_featured: p.isFeatured,
        aspect_ratio: p.aspectRatio,
        display_order: p.order,
      }));
      await supabase.from("photos").insert(photosPayload);
    }

    // 4. Seed Testimonials if empty
    const { data: existingTestimonials } = await supabase.from("testimonials").select("id").limit(1);
    if (!existingTestimonials || existingTestimonials.length === 0) {
      const testimonialsPayload = MOCK_TESTIMONIALS.map((t) => ({
        client_name: t.clientName,
        role_or_event: t.roleOrEvent,
        quote: t.quote,
        avatar_url: t.avatarUrl,
        rating: t.rating,
        brand_slug: t.brandSlug,
      }));
      await supabase.from("testimonials").insert(testimonialsPayload);
    }

    // 5. Seed Packages if empty
    const { data: existingPackages } = await supabase.from("packages").select("id").limit(1);
    if (!existingPackages || existingPackages.length === 0) {
      const packagesPayload = MOCK_PACKAGES.map((p) => ({
        brand_slug: p.brandSlug,
        name: p.name,
        price: p.price,
        period: p.period,
        description: p.description,
        features: p.features,
        is_popular: p.isPopular,
        popular_label: p.popularLabel,
        wa_message: p.waMessage,
        display_order: p.order,
      }));
      await supabase.from("packages").insert(packagesPayload);
    }

    return NextResponse.json({ success: true, message: "Data sampel awal (termasuk paket harga) berhasil diimpor ke Supabase!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal impor data ke Supabase" }, { status: 500 });
  }
}
