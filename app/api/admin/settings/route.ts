import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

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

    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

    const payload: any = {
      company_name: companyName,
      tagline,
      about_text: aboutText,
      whatsapp_number: whatsappNumber,
      default_whatsapp_message: defaultWhatsappMessage,
      address,
      email,
      instagram_url: instagramUrl,
      youtube_url: youtubeUrl,
      updated_at: new Date().toISOString(),
    };

    if (aboutImageUrl !== undefined) payload.about_image_url = aboutImageUrl;
    if (cameraImageUrl !== undefined) payload.camera_image_url = cameraImageUrl;

    let result;
    if (existing) {
      result = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", existing.id);
    } else {
      result = await supabase.from("site_settings").insert([payload]);
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    revalidatePath("/");
    revalidatePath("/tentang");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
