import { getPayload } from "payload";
import { createDeliveryAdapters, deliveryConfiguration, processDeliveries } from "../../src/enquiries/delivery";

// Delivery is an operational command, never a development schema-push action.
Object.assign(process.env, { NODE_ENV: "production" });
const { default: config } = await import("../../payload.config");
const payload = await getPayload({ config });
try {
  const enabled = deliveryConfiguration(process.env);
  const result = await processDeliveries(payload, createDeliveryAdapters(process.env));
  // Maintenance removes hashed rate buckets only, never customer enquiries.
  await payload.delete({ collection: "enquiry-limits", where: { createdAt: { less_than: new Date(Date.now() - 7 * 86400000).toISOString() } }, overrideAccess: true });
  console.log(JSON.stringify({ enabled, ...result }));
  if (result.failed || result.review) process.exitCode = 1;
} finally { await payload.destroy(); }
