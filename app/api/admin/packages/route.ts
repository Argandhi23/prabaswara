import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getPersistedPackages,
  savePersistedPackage,
  deletePersistedPackage,
} from "@/lib/packageStore";
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

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export async function GET() {
  try {
    const diskPackages = getPersistedPackages();

    if (!isSupabaseConfigured) {
      const formattedMock = diskPackages.map((p) => ({
        id: p._id || (p as any).id,
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
      const formattedMock = diskPackages.map((p) => ({
        id: p._id || (p as any).id,
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

    // Keep disk store synced with Supabase items
    data.forEach((item) => savePersistedPackage(item));

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

    savePersistedPackage(newPkg);

    if (isSupabaseConfigured) {
      try {
        const insertPayload: any = {
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
        };

        const { data, error } = await supabase
          .from("packages")
          .insert([insertPayload])
          .select();

        if (!error && data && data.length > 0) {
          savePersistedPackage(data[0]);
          revalidateAllPages();
          return NextResponse.json({ success: true, package: data[0] });
        }
      } catch (dbErr) {
        console.warn("Supabase insert warning, falling back to disk state:", dbErr);
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

    savePersistedPackage(updateFields);

    if (isSupabaseConfigured) {
      try {
        const dbUpdatePayload: any = {
          brand_slug: updateFields.brand_slug,
          name: updateFields.name,
          price: updateFields.price,
          period: updateFields.period,
          description: updateFields.description,
          features: updateFields.features,
          is_popular: updateFields.is_popular,
          popular_label: updateFields.popular_label,
          wa_message: updateFields.wa_message,
          display_order: updateFields.display_order,
        };

        let data: any[] | null = null;

        // Step 1: If id is valid UUID, update by id
        if (isValidUUID(id)) {
          const res = await supabase
            .from("packages")
            .update(dbUpdatePayload)
            .eq("id", id)
            .select();

          if (res.data && res.data.length > 0) {
            data = res.data;
          }
        }

        // Step 2: Fallback update by name & brand_slug if non-UUID or eq(id) returned 0 rows
        if (!data || data.length === 0) {
          const resName = await supabase
            .from("packages")
            .update(dbUpdatePayload)
            .eq("name", updateFields.name)
            .eq("brand_slug", updateFields.brand_slug)
            .select();

          if (resName.data && resName.data.length > 0) {
            data = resName.data;
          }
        }

        // Step 3: Fallback insert if not found in Supabase
        if (!data || data.length === 0) {
          const insertPayload: any = { ...dbUpdatePayload };
          if (isValidUUID(id)) insertPayload.id = id;

          const resInsert = await supabase
            .from("packages")
            .insert([insertPayload])
            .select();

          if (resInsert.data && resInsert.data.length > 0) {
            data = resInsert.data;
          }
        }

        if (data && data.length > 0) {
          savePersistedPackage(data[0]);
          revalidateAllPages();
          return NextResponse.json({ success: true, package: data[0] });
        }
      } catch (dbErr) {
        console.warn("Supabase update warning, falling back to disk state:", dbErr);
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

    deletePersistedPackage(id);

    if (isSupabaseConfigured) {
      try {
        if (isValidUUID(id)) {
          await supabase.from("packages").delete().eq("id", id);
        } else {
          await supabase.from("packages").delete().eq("id", id);
        }
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
