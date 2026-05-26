import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { TraceRecord } from "@/lib/types";

type KvStore = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

const KEY = "intentscope:traces";

function asKvStore(maybe: unknown): KvStore | null {
  if (!maybe || typeof maybe !== "object") return null;
  const candidate = maybe as Partial<KvStore>;
  return typeof candidate.get === "function" && typeof candidate.put === "function" ? (candidate as KvStore) : null;
}

async function getKvStore(): Promise<KvStore | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return asKvStore((env as Record<string, unknown>).INTENTSCOPE_TRACE_KV);
  } catch {
    return null;
  }
}

async function getLocalPath() {
  const [{ mkdir, readFile, writeFile }, { join }] = await Promise.all([import("node:fs/promises"), import("node:path")]);
  const localDir = join(process.cwd(), ".intentscope-state");
  return {
    localPath: join(localDir, "traces.json"),
    mkdir,
    readFile,
    writeFile,
    localDir,
  };
}

async function readLocal(): Promise<TraceRecord[]> {
  try {
    const { readFile, localPath } = await getLocalPath();
    const raw = await readFile(localPath, "utf8");
    return JSON.parse(raw) as TraceRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(records: TraceRecord[]): Promise<void> {
  const { mkdir, writeFile, localDir, localPath } = await getLocalPath();
  await mkdir(localDir, { recursive: true });
  await writeFile(localPath, JSON.stringify(records.slice(0, 24), null, 2), "utf8");
}

export async function listTraces(): Promise<TraceRecord[]> {
  const kv = await getKvStore();
  if (kv) {
    const raw = await kv.get(KEY);
    return raw ? (JSON.parse(raw) as TraceRecord[]) : [];
  }
  return readLocal();
}

export async function saveTrace(record: TraceRecord): Promise<TraceRecord[]> {
  const records = [record, ...(await listTraces()).filter((item) => item.id !== record.id)].slice(0, 24);
  const kv = await getKvStore();
  if (kv) {
    await kv.put(KEY, JSON.stringify(records));
  } else {
    await writeLocal(records);
  }
  return records;
}
