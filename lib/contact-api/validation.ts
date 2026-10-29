import type { ContactPayload } from "../contact";

export const MAX_BODY_BYTES = 64 * 1024;

export class ContactInputError extends Error {
  constructor(public readonly status: number) {
    super("Invalid contact request");
  }
}

export function validateContact(value: unknown): ContactPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContactInputError(400);
  }
  const record = value as Record<string, unknown>;
  const limits = {
    name: 200,
    email: 254,
    subject: 200,
    body: 10000,
    userEnv: 4000,
  };
  const allowed = [...Object.keys(limits), "sentFrom"];
  if (
    Object.keys(record).some((key) => !allowed.includes(key)) ||
    record.sentFrom !== "app"
  ) {
    throw new ContactInputError(400);
  }
  const fields: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    if (typeof record[key] !== "string") throw new ContactInputError(400);
    const text = record[key].trim();
    if (!text || text.length > max || text.includes("\0"))
      throw new ContactInputError(400);
    fields[key] = text;
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ||
    /[\r\n]/.test(fields.name + fields.email + fields.subject) ||
    fields.body.length < 20
  ) {
    throw new ContactInputError(400);
  }
  return { ...fields, sentFrom: "app" } as ContactPayload;
}

export async function readContact(request: Request): Promise<ContactPayload> {
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json" ||
    (request.headers.has("content-encoding") &&
      request.headers.get("content-encoding") !== "identity")
  ) {
    throw new ContactInputError(415);
  }
  const length = request.headers.get("content-length");
  if (
    length !== null &&
    (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)
  ) {
    throw new ContactInputError(413);
  }
  if (!request.body) throw new ContactInputError(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ContactInputError(408)), 3000);
  });
  try {
    while (true) {
      const { value, done } = await Promise.race([reader.read(), expired]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new ContactInputError(413);
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    try {
      return validateContact(
        JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
      );
    } catch (error) {
      if (error instanceof ContactInputError) throw error;
      throw new ContactInputError(400);
    }
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => undefined);
  }
}
