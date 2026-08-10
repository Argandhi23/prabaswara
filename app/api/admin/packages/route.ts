import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_PACKAGES, saveMockPackage, deleteMockPackage } from "@/lib/mockData";
import { revalidatePath } from "next/cache";

function revalidateAllPages() {
  try {
    revalidatePath("/", "layout");
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

    const newPkg = {
      id: `pkg-${Date.now()}`,
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
    };

    // Always update in-memory state
    saveMockPackage(newPkg);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("packages")
          .insert([
            {
              brand_slug: newPkg.brand_slug,
              name: newPkg.name,
              price: newPkg.price,
              period: newPkg.period,
              description: newPkg.description,
              features: newPkg.features,
              is_popular: newPkg.is_popular,
              popular_label: newPkg.popular_label,
              wa_message: newPkg.wa_message,
              display_order: newPkg.display_order,
            },
          ])
          .select();

        if (!error && data && data.length > 0) {
          revalidateAllPages();
          return NextResponse.json({ success: true, package: data[0] });
        }
      } catch (dbErr) {
        console.warn("Supabase insert warning, falling back to mock state:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: newPkg });
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

    const updateFields: any = {
      id,
      brand_slug: brand_slug ? brand_slug.trim() : "swara-studio",
      name: name ? name.trim() : "",
      price: price ? price.trim() : "",
      period: period ? period.trim() : "",
      description: description ? description.trim() : "",
      features: Array.isArray(features) ? features : [],
      is_popular: Boolean(is_popular),
      popular_label: popular_label ? popular_label.trim() : "PALING POPULER",
      wa_message: wa_message ? wa_message.trim() : "",
      display_order: Number(display_order) || 0,
    };

    // Always update in-memory state
    saveMockPackage(updateFields);

    if (isSupabaseConfigured) {
      try {
        const dbUpdatePayload: any = {};
        if (brand_slug !== undefined) dbUpdatePayload.brand_slug = brand_slug.trim();
        if (name !== undefined) dbUpdatePayload.name = name.trim();
        if (price !== undefined) dbUpdatePayload.price = price.trim();
        if (period !== undefined) dbUpdatePayload.period = period.trim();
        if (description !== undefined) dbUpdatePayload.description = description.trim();
        if (features !== undefined) dbUpdatePayload.features = Array.isArray(features) ? features : [];
        if (is_popular !== undefined) dbUpdatePayload.is_popular = Boolean(is_popular);
        if (popular_label !== undefined) dbUpdatePayload.popular_label = popular_label.trim();
        if (wa_message !== undefined) dbUpdatePayload.wa_message = wa_message.trim();
        if (display_order !== undefined) dbUpdatePayload.display_order = Number(display_order);

        const { data, error } = await supabase
          .from("packages")
          .update(dbUpdatePayload)
          .eq("id", id)
          .select();

        if (!error && data && data.length > 0) {
          revalidateAllPages();
          return NextResponse.json({ success: true, package: data[0] });
        }
      } catch (dbErr) {
        console.warn("Supabase update warning, falling back to mock state:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: updateFields });
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

    // Always update in-memory state
    deleteMockPackage(id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from("packages").delete().eq("id", id);
      } catch (dbErr) {
        console.warn("Supabase delete warning:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
