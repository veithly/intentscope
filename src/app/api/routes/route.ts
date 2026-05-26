import { NextResponse } from "next/server";
import { fetchRouteSnapshot } from "@/lib/lifi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await fetchRouteSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load LI.FI route inventory.",
      },
      { status: 502 },
    );
  }
}
