import { NextResponse } from "next/server";
import { listTraces, saveTrace } from "@/lib/trace-store";
import type { TraceRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ traces: await listTraces() });
}

export async function POST(request: Request) {
  const record = (await request.json()) as TraceRecord;
  const traces = await saveTrace(record);
  return NextResponse.json({ traces });
}
