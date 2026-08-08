import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

function revalidateAllPhotoPages() {
  try {
    revalidatePath("/");
    revalidatePath("/swara-gallery");
    revalidatePath("/swara-studio");
    revalidatePath("/swara-moment");
    revalidatePath("/swara-wedding");
    revalidatePath("/[brandSlug]", "page");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ photos: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, imageUrl, caption, brandSlug, brandTitle, isFeatured, aspectRatio, displayOrder } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Judul dan Gambar wajib diisi!" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("photos")
      .insert([
        {
          title: title.trim(),
          image_url: imageUrl.trim(),
          caption: caption ? caption.trim() : "",
          brand_slug: brandSlug || "swara-gallery",
          brand_title: brandTitle || "Swara Gallery",
          is_featured: Boolean(isFeatured),
          aspect_ratio: aspectRatio || "portrait",
          display_order: Number(displayOrder) || 0,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPhotoPages();
    return NextResponse.json({ success: true, photo: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, title, imageUrl, caption, brandSlug, brandTitle, isFeatured, aspectRatio, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "ID Foto diperlukan." }, { status: 400 });
    }

    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (imageUrl !== undefined) updateFields.image_url = imageUrl.trim();
    if (caption !== undefined) updateFields.caption = caption.trim();
    if (brandSlug !== undefined) updateFields.brand_slug = brandSlug;
    if (brandTitle !== undefined) updateFields.brand_title = brandTitle;
    if (isFeatured !== undefined) updateFields.is_featured = Boolean(isFeatured);
    if (aspectRatio !== undefined) updateFields.aspect_ratio = aspectRatio;
    if (displayOrder !== undefined) updateFields.display_order = Number(displayOrder);

    const { data, error } = await supabase
      .from("photos")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPhotoPages();
    return NextResponse.json({ success: true, photo: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID Foto diperlukan." }, { status: 400 });
    }

    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPhotoPages();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
