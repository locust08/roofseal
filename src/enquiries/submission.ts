import { createHash, createHmac } from "node:crypto";
import type { Payload } from "payload";
import { ENQUIRY_CONSENT } from "./shared";

type Input = { reference: string; kind: "contact" | "quote"; name: string; email: string; phone: string; company: string; message: string; productIds: number[] };
class InvalidInput extends Error {}
const reply = (status: number, body: object, headers = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function validate(data: unknown): Input {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new InvalidInput();
  const value = data as Record<string, unknown>;
  const text = (key: string, max: number, min = 0) => {
    const field = value[key] ?? "";
    if (typeof field !== "string" || field.trim().length < min || field.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(field)) throw new InvalidInput();
    return field.trim();
  };
  const reference = text("reference", 36, 36).toLowerCase();
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(reference)) throw new InvalidInput();
  if (!["contact", "quote"].includes(String(value.kind)) || value.consent !== true || text("website", 200)) throw new InvalidInput();
  const email = text("email", 254, 3).toLowerCase();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new InvalidInput();
  const phone = text("phone", 40, 5);
  if (!/^[+\d ()\-.]{5,40}$/.test(phone) || phone.replace(/\D/g, "").length < 5) throw new InvalidInput();
  const ids = value.productIds ?? [];
  if (!Array.isArray(ids) || ids.length > 25 || ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new InvalidInput();
  const productIds = [...new Set<number>(ids)].sort((a, b) => a - b);
  if ((value.kind === "quote" && !productIds.length) || (value.kind === "contact" && productIds.length)) throw new InvalidInput();
  return { reference, kind: value.kind as Input["kind"], name: text("name", 100, 2), email, phone, company: text("company", 160), message: text("message", 5000, 5), productIds };
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new InvalidInput();
  const parts: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw new RangeError(); }
    parts.push(value);
  }
  try { return JSON.parse(Buffer.concat(parts).toString("utf8")); }
  catch { throw new InvalidInput(); }
}

async function reserveRateSlot(request: Request, payload: Payload, env: Record<string, string | undefined>) {
  const trusted = env.ENQUIRY_IP_HEADER;
  // Never trust client-controlled X-Forwarded-For by default. The deployment proxy
  // must strip/overwrite the configured single-address header.
  const address = (trusted ? request.headers.get(trusted)?.slice(0, 200) : null) || "shared";
  const window = Math.floor(Date.now() / 900000);
  const key = createHmac("sha256", env.PAYLOAD_SECRET || payload.config.secret).update(`${address}:${window}`).digest("hex");
  const now = new Date().toISOString();
  const result = await payload.db.drizzle.$client.execute({
    sql: "INSERT INTO enquiry_limits (key, count, created_at, updated_at) VALUES (?, 1, ?, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at WHERE count < 5 RETURNING id",
    args: [key, now, now],
  });
  return result.rows.length > 0;
}

export async function submitEnquiry(request: Request, payload: Payload, env: Record<string, string | undefined> = process.env): Promise<Response> {
  let allowedOrigin: string;
  try { allowedOrigin = new URL(env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").origin; }
  catch { return reply(503, { error: "Enquiries are temporarily unavailable. Please try again later." }); }
  const origin = request.headers.get("origin");
  const localOrigin = env.NODE_ENV !== "production" ? new URL(request.url).origin : allowedOrigin;
  if (!origin || (origin !== allowedOrigin && origin !== localOrigin)) return reply(403, { error: "Please submit from the Roofseal website." });
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415, { error: "Expected a JSON submission." });
  try {
    const raw = await readBody(request);
    let input: Input;
    try { input = validate(raw); }
    catch (error) { await reserveRateSlot(request, payload, env); throw error; }
    const requestHash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
    const existing = async () => (await payload.find({ collection: "enquiries", where: { reference: { equals: input.reference } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
    const repeated = (doc: Awaited<ReturnType<typeof existing>>) => doc.requestHash === requestHash
      ? reply(200, { reference: doc.reference }) : reply(409, { error: "This submission reference was already used. Start a new enquiry." });
    const previous = await existing();
    if (previous) return repeated(previous);
    if (!await reserveRateSlot(request, payload, env)) return reply(429, { error: "Too many enquiries. Please try again in 15 minutes." }, { "Retry-After": "900" });
    const products = input.productIds.length ? (await payload.find({ collection: "products", where: { and: [{ id: { in: input.productIds } }, { _status: { equals: "published" } }] }, limit: 25, depth: 0, overrideAccess: true })).docs : [];
    if (products.length !== input.productIds.length) return reply(400, { error: "A selected product is no longer available. Please update your quote list." });
    try {
      await payload.create({ collection: "enquiries", overrideAccess: true, data: {
        reference: input.reference, requestHash, kind: input.kind, name: input.name, email: input.email,
        phone: input.phone, company: input.company, message: input.message,
        consentAt: new Date().toISOString(), consentText: ENQUIRY_CONSENT, status: "new",
        products: products.map((p) => ({ productId: p.id, title: p.title, slug: p.slug })),
        emailDelivery: { status: "pending", attempts: 0 }, sheetDelivery: { status: "pending", attempts: 0 },
      } });
    } catch (error) {
      // A concurrent retry may have inserted the same unique reference first.
      const winner = await existing();
      if (winner) return repeated(winner);
      throw error;
    }
    return reply(201, { reference: input.reference });
  } catch (error) {
    if (error instanceof RangeError) return reply(413, { error: "The enquiry is too large." });
    if (error instanceof InvalidInput) return reply(400, { error: "Please check your name, email, phone, message and consent." });
    // Do not log request bodies, provider responses or personal information.
    return reply(503, { error: "Your enquiry could not be saved. Please retry with the same form." });
  }
}
