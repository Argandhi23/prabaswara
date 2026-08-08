import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";

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
    } = body;

    // Check if site_settings has existing record
    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from("site_settings")
        .update({
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
        })
        .eq("id", existing.id);
    } else {
      result = await supabase.from("site_settings").insert([
        {
          company_name: companyName,
          tagline,
          about_text: aboutText,
          whatsapp_number: whatsappNumber,
          default_whatsapp_message: defaultWhatsappMessage,
          address,
          email,
          instagram_url: instagramUrl,
          youtube_url: youtubeUrl,
        },
      ]);
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
