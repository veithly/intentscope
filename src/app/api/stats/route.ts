import { NextResponse } from "next/server";
import { fetchChainCount, fetchRouteSnapshot } from "@/lib/lifi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [chainCount, routeSnapshot] = await Promise.all([fetchChainCount(), fetchRouteSnapshot()]);
    return NextResponse.json({
      chainCount,
      routeCount: routeSnapshot.routes.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load live LI.FI stats.",
      },
      { status: 502 },
    );
  }
}
