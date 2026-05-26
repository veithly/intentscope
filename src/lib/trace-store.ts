import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { TraceRecord } from "@/lib/types";

type KvStore = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

const KEY = "intentscope:traces";
const LOCAL_DIR = join(process.cwd(), ".intentscope-state");
const LOCAL_PATH = join(LOCAL_DIR, "traces.json");

function getKvStore(): KvStore | null {
  const maybe = (globalThis as unknown as { INTENTSCOPE_TRACE_KV?: unknown }).INTENTSCOPE_TRACE_KV;
  if (!maybe || typeof maybe !== "object") return null;
  const candidate = maybe as Partial<KvStore>;
  return typeof candidate.get === "function" && typeof candidate.put === "function" ? (candidate as KvStore) : null;
}

async function readLocal(): Promise<TraceRecord[]> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as TraceRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(records: TraceRecord[]): Promise<void> {
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(LOCAL_PATH, JSON.stringify(records.slice(0, 24), null, 2), "utf8");
}

export async function listTraces(): Promise<TraceRecord[]> {
  const kv = getKvStore();
  if (kv) {
    const raw = await kv.get(KEY);
    return raw ? (JSON.parse(raw) as TraceRecord[]) : [];
  }
  return readLocal();
}

export async function saveTrace(record: TraceRecord): Promise<TraceRecord[]> {
  const records = [record, ...(await listTraces()).filter((item) => item.id !== record.id)].slice(0, 24);
  const kv = getKvStore();
  if (kv) {
    await kv.put(KEY, JSON.stringify(records));
  } else {
    await writeLocal(records);
  }
  return records;
}
