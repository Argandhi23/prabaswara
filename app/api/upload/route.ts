import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase/client";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Akses ditolak. Sesi login admin telah berakhir." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan." }, { status: 400 });
    }

    // Security Check: Validate MIME type
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung. Harap upload gambar (JPG, PNG, WebP, AVIF)." }, { status: 400 });
    }

    // Security Check: File Size Limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file terlalu besar. Maksimal 10MB." }, { status: 400 });
    }

    const ext = file.name ? file.name.split(".").pop()?.toLowerCase() || "webp" : "webp";
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Attempt 1: Upload to Supabase Storage Bucket 'prabaswara-media'
    let { data: uploadData, error: uploadError } = await supabase.storage
      .from("prabaswara-media")
      .upload(filename, buffer, {
        contentType: file.type || "image/webp",
        cacheControl: "3600",
        upsert: true,
      });

    // If bucket doesn't exist, attempt auto-creating it and re-trying upload
    if (uploadError && (uploadError.message?.toLowerCase().includes("not found") || uploadError.message?.toLowerCase().includes("bucket"))) {
      try {
        await supabase.storage.createBucket("prabaswara-media", { public: true });
        const retry = await supabase.storage
          .from("prabaswara-media")
          .upload(filename, buffer, {
            contentType: file.type || "image/webp",
            cacheControl: "3600",
            upsert: true,
          });
        uploadData = retry.data;
        uploadError = retry.error;
      } catch (bucketErr) {
        console.warn("Auto create bucket failed:", bucketErr);
      }
    }

    if (uploadError || !uploadData) {
      console.error("Supabase Storage error:", uploadError);
      return NextResponse.json(
        {
          error: `Gagal mengunggah ke Supabase Storage: ${uploadError?.message || "Storage upload failed"}. Pastikan bucket 'prabaswara-media' telah dibuat dan diset Public di dashboard Supabase.`,
        },
        { status: 500 }
      );
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("prabaswara-media")
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan internal saat unggah file." }, { status: 500 });
  }
}
