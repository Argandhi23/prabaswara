import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_PACKAGES } from "@/lib/mockData";
import { revalidatePath } from "next/cache";

function revalidateAllPages() {
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
    if (!isSupabaseConfigured) {
      const formattedMock = MOCK_PACKAGES.map((p) => ({
        id: p._id,
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
      return NextResponse.json({ packages: formattedMock });
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      const formattedMock = MOCK_PACKAGES.map((p) => ({
        id: p._id,
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
      return NextResponse.json({ packages: formattedMock });
    }

    return NextResponse.json({ packages: data });
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
      brand_slug,
      name,
      price,
      period,
      description,
      features,
      is_popular,
      popular_label,
      wa_message,
      display_order,
    } = body;

    if (!name || !price || !brand_slug) {
      return NextResponse.json(
        { error: "Nama paket, harga, dan kategori sub-brand wajib diisi!" },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Supabase belum dikonfigurasi. Silakan atur env vars Supabase." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("packages")
      .insert([
        {
          brand_slug: brand_slug.trim(),
          name: name.trim(),
          price: price.trim(),
          period: period ? period.trim() : "",
          description: description ? description.trim() : "",
          features: Array.isArray(features) ? features : [],
          is_popular: Boolean(is_popular),
          popular_label: popular_label ? popular_label.trim() : "PALING POPULER",
          wa_message: wa_message ? wa_message.trim() : "",
          display_order: Number(display_order) || 0,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      id,
      brand_slug,
      name,
      price,
      period,
      description,
      features,
      is_popular,
      popular_label,
      wa_message,
      display_order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID Paket diperlukan." }, { status: 400 });
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Supabase belum dikonfigurasi. Silakan atur env vars Supabase." },
        { status: 400 }
      );
    }

    const updateFields: any = {};
    if (brand_slug !== undefined) updateFields.brand_slug = brand_slug.trim();
    if (name !== undefined) updateFields.name = name.trim();
    if (price !== undefined) updateFields.price = price.trim();
    if (period !== undefined) updateFields.period = period.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (features !== undefined) updateFields.features = Array.isArray(features) ? features : [];
    if (is_popular !== undefined) updateFields.is_popular = Boolean(is_popular);
    if (popular_label !== undefined) updateFields.popular_label = popular_label.trim();
    if (wa_message !== undefined) updateFields.wa_message = wa_message.trim();
    if (display_order !== undefined) updateFields.display_order = Number(display_order);

    const { data, error } = await supabase
      .from("packages")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: data[0] });
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
      return NextResponse.json({ error: "ID Paket diperlukan." }, { status: 400 });
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Supabase belum dikonfigurasi." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
