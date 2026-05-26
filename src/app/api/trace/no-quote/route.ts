import { NextResponse } from "next/server";
import { fetchLiveTrace } from "@/lib/lifi";
import { saveTrace } from "@/lib/trace-store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const trace = await fetchLiveTrace("no-quote");
    await saveTrace(trace);
    return NextResponse.json(trace);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to request the no-quote scenario.",
      },
      { status: 502 },
    );
  }
}
