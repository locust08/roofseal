import type { Payload } from "payload";
import type { Enquiry } from "../payload-types";
import { GoogleAuth } from "google-auth-library";
export class DeliveryError extends Error {
  constructor(message: string, public uncertain: boolean) { super(message); }
}
type Adapter = (enquiry: Enquiry) => Promise<string>;
type Adapters = Partial<Record<"email" | "sheet", Adapter>>;
export function deliveryConfiguration(env: Record<string, string | undefined>) {
  return {
    email: env.ENQUIRY_EMAIL_ENABLED === "true" && !!env.RESEND_API_KEY && !!env.ENQUIRY_EMAIL_FROM && !!env.ENQUIRY_EMAIL_TO,
    sheet: env.ENQUIRY_SHEETS_ENABLED === "true" && !!env.GOOGLE_SHEETS_ID && !!env.GOOGLE_SHEETS_RANGE && !!env.GOOGLE_SERVICE_ACCOUNT_EMAIL && !!env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  };
}

export function createDeliveryAdapters(env: Record<string, string | undefined>, dependencies: { fetch?: typeof fetch; googleAccessToken?: () => Promise<string> } = {}): Adapters {
  const send = dependencies.fetch || fetch;
  const ready = deliveryConfiguration(env);
  const adapters: Adapters = {};
  async function post(url: string, init: RequestInit) {
    let response: Response;
    try { response = await send(url, { ...init, signal: AbortSignal.timeout(15000) }); }
    catch { throw new DeliveryError("delivery_outcome_unknown", true); }
    if (!response.ok) {
      // A server error may happen after an append/send. Never blindly repeat it.
      throw new DeliveryError(`provider_rejected_${response.status}`, response.status >= 500 || response.status === 408 || response.status === 409);
    }
    try { return await response.json(); }
    catch { throw new DeliveryError("provider_confirmation_missing", true); }
  }
  if (ready.email) {
    adapters.email = async (doc) => {
      const data = await post("https://api.resend.com/emails", { method: "POST", headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `roofseal-enquiry/${doc.reference}`,
      }, body: JSON.stringify({
        from: env.ENQUIRY_EMAIL_FROM,
        to: env.ENQUIRY_EMAIL_TO!.split(",").map((email) => email.trim()).filter(Boolean),
        reply_to: doc.email,
        subject: `Roofseal ${doc.kind === "quote" ? "quotation request" : "enquiry"} — ${doc.reference}`,
        text: [
          `Reference: ${doc.reference}`, `Received: ${doc.createdAt}`, `Name: ${doc.name}`, `Email: ${doc.email}`,
          `Phone: ${doc.phone}`, `Company: ${doc.company || "—"}`, "", "Products:",
          ...(doc.products?.map((p) => `${p.title} (ID ${p.productId}; /products/${p.slug})`) || []), "", doc.message,
        ].join("\n"),
      }) });
      if (typeof data.id !== "string") throw new DeliveryError("provider_confirmation_missing", true);
      return data.id;
    };
  }
  if (ready.sheet) {
    const auth = new GoogleAuth({ credentials: { client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n") }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
    const token = dependencies.googleAccessToken || (async () => {
      try {
        const value = await auth.getAccessToken();
        if (!value) throw new Error("No token");
        return value;
      } catch { throw new DeliveryError("google_authorization_failed", false); }
    });
    adapters.sheet = async (doc) => {
      // Token acquisition precedes the append, so its failure is safe to retry.
      const accessToken = await token();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEETS_ID!)}/values/${encodeURIComponent(env.GOOGLE_SHEETS_RANGE!)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
      const data = await post(url, { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({
        majorDimension: "ROWS",
        values: [[doc.reference, doc.createdAt, doc.kind, doc.name, doc.email, doc.phone, doc.company || "", doc.message,
          doc.products?.map((p) => `${p.title} [${p.productId}]`).join("; ") || "", doc.consentAt, doc.consentText]],
      }) });
      if (typeof data.updates?.updatedRange !== "string") throw new DeliveryError("provider_confirmation_missing", true);
      return data.updates.updatedRange;
    };
  }
  return adapters;
}

export async function processDeliveries(payload: Payload, adapters: Adapters) {
  const result = { sent: 0, failed: 0, review: 0 };
  for (const channel of ["email", "sheet"] as const) {
    // Identifiers are exclusively these fixed literals, never request data.
    const column = `${channel}_delivery`;
    const group = `${channel}Delivery` as const;
    const now = new Date().toISOString();
    const stale = await payload.db.drizzle.$client.execute({ sql: `UPDATE enquiries SET ${column}_status = 'review', ${column}_last_error = 'worker_interrupted_check_provider' WHERE ${column}_status = 'sending' AND (${column}_last_attempt_at < ? OR ${column}_last_attempt_at IS NULL)`, args: [new Date(Date.now() - 900000).toISOString()] });
    result.review += stale.rowsAffected;
    const adapter = adapters[channel];
    if (!adapter) continue;
    const candidates = await payload.find({ collection: "enquiries", overrideAccess: true, depth: 0, limit: 20, sort: "createdAt", where: { and: [
      { [`${group}.status`]: { in: ["pending", "failed"] } },
      { [`${group}.attempts`]: { less_than: 5 } },
      { or: [{ [`${group}.nextAttemptAt`]: { exists: false } }, { [`${group}.nextAttemptAt`]: { less_than_equal: now } }] },
    ] } });
    for (const candidate of candidates.docs) {
      const claimed = await payload.db.drizzle.$client.execute({ sql: `UPDATE enquiries SET ${column}_status = 'sending', ${column}_attempts = ${column}_attempts + 1, ${column}_last_attempt_at = ?, updated_at = ? WHERE id = ? AND ${column}_status IN ('pending', 'failed') AND ${column}_attempts < 5 AND (${column}_next_attempt_at IS NULL OR ${column}_next_attempt_at <= ?) RETURNING id`, args: [now, now, candidate.id, now] });
      if (!claimed.rows.length) continue;
      const doc = await payload.findByID({ collection: "enquiries", id: candidate.id, depth: 0, overrideAccess: true });
      let status: "sent" | "failed" | "review" = "sent", error: string | null = null, providerId: string | null = null, nextAttempt: string | null = null;
      try { providerId = await adapter(doc); }
      catch (cause) {
        const known = cause instanceof DeliveryError;
        status = !known || cause.uncertain ? "review" : "failed";
        error = known ? cause.message : "delivery_outcome_unknown";
        if (status === "failed") nextAttempt = new Date(Date.now() + 60000 * 2 ** (doc[group]?.attempts || 1)).toISOString();
      }
      // A failure to persist confirmation deliberately leaves 'sending'; recovery
      // requires checking the provider rather than risking a second delivery.
      await payload.db.drizzle.$client.execute({ sql: `UPDATE enquiries SET ${column}_status = ?, ${column}_last_error = ?, ${column}_provider_id = ?, ${column}_next_attempt_at = ?, updated_at = ? WHERE id = ? AND ${column}_status = 'sending'`, args: [status, error, providerId, nextAttempt, new Date().toISOString(), doc.id] });
      result[status]++;
    }
  }
  return result;
}
