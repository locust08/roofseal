import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { config as loadEnv } from "dotenv";

loadEnv({ path: [".env.local", ".env"], quiet: true });
mkdirSync(".data", { recursive: true });
const envPath = ".env.local";
let contents = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const required = {
  PAYLOAD_SECRET: randomBytes(32).toString("hex"),
  DATABASE_URL: "file:./.data/roofseal.db",
  NEXT_PUBLIC_SERVER_URL: "http://localhost:3000",
  CMS_ADMIN_EMAIL: "admin@roofseal.local",
  CMS_ADMIN_PASSWORD: randomBytes(24).toString("base64url"),
};
for (const [key, fallback] of Object.entries(required)) {
  if (!process.env[key]) {
    process.env[key] = fallback;
    contents += `\n${key}=${fallback}`;
  }
}
writeFileSync(envPath, contents.trim() + "\n", { mode: 0o600 });
const { getPayload } = await import("payload");
const { default: config } = await import("../../payload.config");
const payload = await getPayload({ config });
const users = await payload.find({ collection: "users", limit: 1, overrideAccess: true });
if (users.totalDocs === 0) {
  await payload.create({ collection: "users", overrideAccess: true, data: {
    email: process.env.CMS_ADMIN_EMAIL!, password: process.env.CMS_ADMIN_PASSWORD!,
    name: "Roofseal Administrator", role: "admin",
  } });
  writeFileSync(".data/admin-access.txt", `Local Roofseal CMS\nURL: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin\nEmail: ${process.env.CMS_ADMIN_EMAIL}\nPassword: ${process.env.CMS_ADMIN_PASSWORD}\n`, { mode: 0o600 });
  console.log("Local administrator created. Private login details: .data/admin-access.txt");
} else {
  console.log("Existing administrator retained.");
}
await payload.destroy();
process.exit(0);
