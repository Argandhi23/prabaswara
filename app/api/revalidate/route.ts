import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");

    // Optional secret token check
    if (
      process.env.SANITY_REVALIDATE_SECRET &&
      secret !== process.env.SANITY_REVALIDATE_SECRET
    ) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Revalidate all key site routes
    revalidatePath("/", "layout");
    revalidatePath("/swara-gallery");
    revalidatePath("/swara-studio");
    revalidatePath("/swara-moment");
    revalidatePath("/swara-wedding");
    revalidatePath("/tentang");
    revalidatePath("/testimoni");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: "Revalidation triggered successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}
