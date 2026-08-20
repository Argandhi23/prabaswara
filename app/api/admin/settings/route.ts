import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { formatWhatsAppNumber } from "@/lib/whatsapp";
import { getPersistedSiteSettings, savePersistedSiteSettings } from "@/lib/siteSettingsStore";

export async function GET() {
  try {
    const localSettings = getPersistedSiteSettings();
    let dbSettings: any = null;

    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        dbSettings = data;
      }
    } catch (e) {
      console.warn("Supabase fetch site_settings warning:", e);
    }

    const mergedSettings = {
      company_name: dbSettings?.company_name || localSettings.companyName,
      tagline: dbSettings?.tagline || localSettings.tagline,
      about_text: dbSettings?.about_text || localSettings.aboutText,
      whatsapp_number: dbSettings?.whatsapp_number || localSettings.whatsappNumber,
      default_whatsapp_message: dbSettings?.default_whatsapp_message || localSettings.defaultWhatsappMessage,
      address: dbSettings?.address || localSettings.address,
      email: dbSettings?.email || localSettings.email,
      instagram_url: dbSettings?.instagram_url || localSettings.instagramUrl,
      youtube_url: dbSettings?.youtube_url || localSettings.youtubeUrl,
      camera_image_url: dbSettings?.camera_image_url || localSettings.cameraImageUrl,
      about_image_url: dbSettings?.about_image_url || localSettings.aboutImageUrl,
    };

    return NextResponse.json({ settings: mergedSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      companyName,
      tagline,
      aboutText,
      whatsappNumber,
      defaultWhatsappMessage,
      address,
      email,
      instagramUrl,
      youtubeUrl,
      aboutImageUrl,
      cameraImageUrl,
    } = body;

    // 1. Save to local disk store first (guarantees persistence even if DB schema lacks column)
    const updatedLocal = savePersistedSiteSettings({
      ...(companyName !== undefined && { companyName }),
      ...(tagline !== undefined && { tagline }),
      ...(aboutText !== undefined && { aboutText }),
      ...(whatsappNumber !== undefined && { whatsappNumber }),
      ...(defaultWhatsappMessage !== undefined && { defaultWhatsappMessage }),
      ...(address !== undefined && { address }),
      ...(email !== undefined && { email }),
      ...(instagramUrl !== undefined && { instagramUrl }),
      ...(youtubeUrl !== undefined && { youtubeUrl }),
      ...(aboutImageUrl !== undefined && { aboutImageUrl }),
      ...(cameraImageUrl !== undefined && { cameraImageUrl }),
    });

    const formattedWaNumber = formatWhatsAppNumber(whatsappNumber || updatedLocal.whatsappNumber || "6287701906556");

    const payload: any = {
      company_name: companyName || updatedLocal.companyName,
      tagline: tagline || updatedLocal.tagline,
      about_text: aboutText !== undefined ? aboutText : updatedLocal.aboutText,
      whatsapp_number: formattedWaNumber,
      default_whatsapp_message: defaultWhatsappMessage !== undefined ? defaultWhatsappMessage : updatedLocal.defaultWhatsappMessage,
      address: address !== undefined ? address : updatedLocal.address,
      email: email !== undefined ? email : updatedLocal.email,
      instagram_url: instagramUrl !== undefined ? instagramUrl : updatedLocal.instagramUrl,
      youtube_url: youtubeUrl !== undefined ? youtubeUrl : updatedLocal.youtubeUrl,
      updated_at: new Date().toISOString(),
    };

    if (aboutImageUrl !== undefined) payload.about_image_url = aboutImageUrl;
    if (cameraImageUrl !== undefined) payload.camera_image_url = cameraImageUrl;

    // 2. Try saving to Supabase DB (with automatic fallback if column is missing in schema)
    try {
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

      let result;
      if (existing) {
        result = await supabase.from("site_settings").update(payload).eq("id", existing.id);
      } else {
        result = await supabase.from("site_settings").insert([payload]);
      }

      // If schema error (e.g. missing 'camera_image_url' column in Supabase table)
      if (result?.error) {
        console.warn("Supabase site_settings save notice:", result.error.message);
        
        // Remove image columns if DB schema doesn't have them yet, so core fields still save
        const safePayload = { ...payload };
        delete safePayload.camera_image_url;
        delete safePayload.about_image_url;

        if (existing) {
          await supabase.from("site_settings").update(safePayload).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").insert([safePayload]);
        }
      }
    } catch (dbErr) {
      console.warn("Supabase site_settings execution warning:", dbErr);
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/tentang");
      revalidatePath("/testimoni");
      revalidatePath("/swara-gallery");
      revalidatePath("/swara-studio");
      revalidatePath("/swara-moment");
      revalidatePath("/swara-wedding");
      revalidatePath("/[brandSlug]", "page");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      settings: {
        company_name: updatedLocal.companyName,
        tagline: updatedLocal.tagline,
        about_text: updatedLocal.aboutText,
        whatsapp_number: updatedLocal.whatsappNumber,
        default_whatsapp_message: updatedLocal.defaultWhatsappMessage,
        address: updatedLocal.address,
        email: updatedLocal.email,
        instagram_url: updatedLocal.instagramUrl,
        youtube_url: updatedLocal.youtubeUrl,
        camera_image_url: updatedLocal.cameraImageUrl,
        about_image_url: updatedLocal.aboutImageUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
