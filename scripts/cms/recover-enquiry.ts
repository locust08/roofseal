import { getPayload } from "payload";

const args = process.argv.slice(2);
const value = (flag: string) => args[args.indexOf(flag) + 1];
const reference = value("--reference"), channel = value("--channel"), action = value("--action");
if (!args.includes("--confirm-provider-checked") || !reference || !["email", "sheet"].includes(channel) || !["retry", "sent"].includes(action)) {
  throw new Error("Usage: --reference UUID --channel email|sheet --action retry|sent --confirm-provider-checked [--provider-id ID]. Check the provider/Sheet for this reference first.");
}
Object.assign(process.env, { NODE_ENV: "production" });
const { default: config } = await import("../../payload.config");
const payload = await getPayload({ config });
try {
  const doc = (await payload.find({ collection: "enquiries", where: { reference: { equals: reference } }, limit: 1, depth: 0 })).docs[0];
  if (!doc) throw new Error("Enquiry not found.");
  const group = channel === "email" ? "emailDelivery" : "sheetDelivery";
  if (!["failed", "review"].includes(doc[group]?.status || "")) throw new Error("Only failed/review deliveries can be recovered. An interrupted claim becomes review after 15 minutes.");
  const providerId = args.includes("--provider-id") ? value("--provider-id") : "";
  if (action === "sent" && !providerId) throw new Error("Provide --provider-id with the confirmed email ID or Sheet range.");
  await payload.update({ collection: "enquiries", id: doc.id, data: { [group]: { ...doc[group], status: action === "sent" ? "sent" : "pending", attempts: action === "retry" ? 0 : doc[group]?.attempts, providerId: providerId || null, nextAttemptAt: null, lastError: null } }, overrideAccess: true });
  console.log(JSON.stringify({ reference, channel, action }));
} finally { await payload.destroy(); }
