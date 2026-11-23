import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getPersistedPackages,
  savePersistedPackage,
  deletePersistedPackage,
  getFallbackOriginalPrices,
  saveFallbackOriginalPrice,
  deleteFallbackOriginalPrice,
  resolvePackageOriginalPrice,
  normalizeOptionalPrice,
} from "@/lib/packageStore";
import { revalidatePath } from "next/cache";

interface SupabasePackagePayload {
  id?: string;
  brand_slug: string;
  name: string;
  price: string;
  original_price?: string | null;
  period: string;
  description: string;
  features: string[];
  is_popular: boolean;
  popular_label: string;
  wa_message: string;
  display_order: number;
}

interface SupabasePackageRow extends SupabasePackagePayload {
  id: string;
  created_at?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server.";
}

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

function isMissingOriginalPriceColumnError(
  error: { code?: string; message?: string } | null
): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    msg.includes("original_price") &&
    (error.code === "PGRST204" ||
      error.code === "42703" ||
      msg.includes("schema cache") ||
      msg.includes("does not exist") ||
      msg.includes("column"))
  );
}

async function upsertPackageInSupabase(
  id: string,
  payload: SupabasePackagePayload
): Promise<{ row: SupabasePackageRow | null; missingOriginalPriceColumn: boolean }> {
  // Step 1: If id is valid UUID, update by id
  if (isValidUUID(id)) {
    const res = await supabase
      .from("packages")
      .update(payload)
      .eq("id", id)
      .select();

    if (isMissingOriginalPriceColumnError(res.error)) {
      return { row: null, missingOriginalPriceColumn: true };
    }
    if (res.data && res.data.length > 0) {
      return { row: res.data[0] as SupabasePackageRow, missingOriginalPriceColumn: false };
    }
  }

  // Step 2: Fallback update by name & brand_slug if non-UUID or eq(id) returned 0 rows
  const resName = await supabase
    .from("packages")
    .update(payload)
    .eq("name", payload.name)
    .eq("brand_slug", payload.brand_slug)
    .select();

  if (isMissingOriginalPriceColumnError(resName.error)) {
    return { row: null, missingOriginalPriceColumn: true };
  }
  if (resName.data && resName.data.length > 0) {
    return { row: resName.data[0] as SupabasePackageRow, missingOriginalPriceColumn: false };
  }

  // Step 3: Fallback insert if not found in Supabase
  const insertPayload: SupabasePackagePayload = { ...payload };
  if (isValidUUID(id)) insertPayload.id = id;

  const resInsert = await supabase
    .from("packages")
    .insert([insertPayload])
    .select();

  if (isMissingOriginalPriceColumnError(resInsert.error)) {
    return { row: null, missingOriginalPriceColumn: true };
  }
  if (resInsert.data && resInsert.data.length > 0) {
    return { row: resInsert.data[0] as SupabasePackageRow, missingOriginalPriceColumn: false };
  }

  return { row: null, missingOriginalPriceColumn: false };
}

export async function GET() {
  try {
    const diskPackages = getPersistedPackages();

    const formatDiskPackages = () =>
      diskPackages.map((p) => ({
        id: p._id || p.id,
        brand_slug: p.brandSlug,
        name: p.name,
        price: p.price,
        original_price: normalizeOptionalPrice(p.originalPrice),
        period: p.period,
        description: p.description,
        features: p.features,
        is_popular: p.isPopular,
        popular_label: p.popularLabel,
        wa_message: p.waMessage,
        display_order: p.order,
      }));

    if (!isSupabaseConfigured) {
      return NextResponse.json({ packages: formatDiskPackages() });
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ packages: formatDiskPackages() });
    }

    const rows = data as SupabasePackageRow[];
    const hasOriginalPriceColumn = rows.some((item) => "original_price" in item);
    const fallbackOriginalPrices = hasOriginalPriceColumn
      ? undefined
      : await getFallbackOriginalPrices();

    const enrichedPackages = rows.map((item) => ({
      ...item,
      original_price: resolvePackageOriginalPrice(item, fallbackOriginalPrices),
    }));

    // Keep disk store synced with Supabase items
    enrichedPackages.forEach((item) => savePersistedPackage(item));

    return NextResponse.json({ packages: enrichedPackages });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
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
      original_price,
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

    const normalizedOriginalPrice = normalizeOptionalPrice(original_price);

    const newPkg = {
      id: `pkg-${Date.now()}`,
      brand_slug: brand_slug.trim(),
      name: name.trim(),
      price: price.trim(),
      original_price: normalizedOriginalPrice,
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
        const insertPayload: SupabasePackagePayload = {
          brand_slug: newPkg.brand_slug,
          name: newPkg.name,
          price: newPkg.price,
          original_price: normalizedOriginalPrice || null,
          period: newPkg.period,
          description: newPkg.description,
          features: newPkg.features,
          is_popular: newPkg.is_popular,
          popular_label: newPkg.popular_label,
          wa_message: newPkg.wa_message,
          display_order: newPkg.display_order,
        };

        let { data, error } = await supabase
          .from("packages")
          .insert([insertPayload])
          .select();

        let usedFallbackStorage = false;

        if (isMissingOriginalPriceColumnError(error)) {
          const safePayload: SupabasePackagePayload = { ...insertPayload };
          delete safePayload.original_price;
          const retry = await supabase
            .from("packages")
            .insert([safePayload])
            .select();
          data = retry.data;
          error = retry.error;
          usedFallbackStorage = true;
        }

        if (!error && data && data.length > 0) {
          const savedRow: SupabasePackageRow = {
            ...(data[0] as SupabasePackageRow),
            original_price: normalizedOriginalPrice,
          };

          if (usedFallbackStorage) {
            await saveFallbackOriginalPrice({
              id: savedRow.id,
              previousId: newPkg.id,
              brandSlug: savedRow.brand_slug,
              name: savedRow.name,
              originalPrice: normalizedOriginalPrice,
            });
          }

          savePersistedPackage(savedRow);
          revalidateAllPages();
          return NextResponse.json({ success: true, package: savedRow });
        }
      } catch (dbErr) {
        console.warn("Supabase insert warning, falling back to disk state:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: newPkg });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
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
      original_price,
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

    const normalizedOriginalPrice = normalizeOptionalPrice(original_price);

    const updateFields = {
      id,
      brand_slug: brand_slug ? brand_slug.trim() : "swara-studio",
      name: name ? name.trim() : "",
      price: price ? price.trim() : "",
      original_price: normalizedOriginalPrice,
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
        const dbUpdatePayload: SupabasePackagePayload = {
          brand_slug: updateFields.brand_slug,
          name: updateFields.name,
          price: updateFields.price,
          original_price: normalizedOriginalPrice || null,
          period: updateFields.period,
          description: updateFields.description,
          features: updateFields.features,
          is_popular: updateFields.is_popular,
          popular_label: updateFields.popular_label,
          wa_message: updateFields.wa_message,
          display_order: updateFields.display_order,
        };

        let result = await upsertPackageInSupabase(id, dbUpdatePayload);
        let usedFallbackStorage = false;

        if (result.missingOriginalPriceColumn) {
          const safePayload: SupabasePackagePayload = { ...dbUpdatePayload };
          delete safePayload.original_price;
          result = await upsertPackageInSupabase(id, safePayload);
          usedFallbackStorage = true;
        }

        if (result.row) {
          const savedRow: SupabasePackageRow = {
            ...result.row,
            original_price: normalizedOriginalPrice,
          };

          if (usedFallbackStorage) {
            await saveFallbackOriginalPrice({
              id: savedRow.id,
              previousId: id,
              brandSlug: savedRow.brand_slug,
              name: savedRow.name,
              originalPrice: normalizedOriginalPrice,
            });
          }

          savePersistedPackage(savedRow);
          revalidateAllPages();
          return NextResponse.json({ success: true, package: savedRow });
        }
      } catch (dbErr) {
        console.warn("Supabase update warning, falling back to disk state:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true, package: updateFields });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
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
    await deleteFallbackOriginalPrice(id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from("packages").delete().eq("id", id);
      } catch (dbErr) {
        console.warn("Supabase delete warning:", dbErr);
      }
    }

    revalidateAllPages();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
