import path from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter, type SQLiteAdapterArgs } from "@payloadcms/db-d1-sqlite";
import { r2Storage, type R2StorageOptions } from "@payloadcms/storage-r2";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Careers, Categories, Media, Products, Resources, Users } from "./src/cms/collections";
import { Enquiries, EnquiryLimits } from "./src/enquiries/collections";

type Bindings = { D1: SQLiteAdapterArgs["binding"]; R2: R2StorageOptions["bucket"]; PAYLOAD_SECRET?: string };
// The build only needs binding shapes. Runtime requests receive the real bindings
// from OpenNext, with credentials supplied as Worker secrets.
const cloudflare = process.env.CLOUDFLARE_DEPLOY === "true"
  ? await (await import(/* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`)).getPlatformProxy({ persist: false })
  : await getCloudflareContext({ async: true });
const env = cloudflare.env as unknown as Bindings;
const secret = env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET;
if (!secret) throw new Error("PAYLOAD_SECRET must be configured as a Worker secret.");

export default buildConfig({
  telemetry: false,
  secret,
  serverURL: "https://roofseal.sites.locus-t.com",
  csrf: ["https://roofseal.sites.locus-t.com", "https://roofseal.easondev.workers.dev", "https://roofseal.locust-crm08.chatgpt.site"],
  logger: { options: { level: "info" }, destination: { write: (message: string) => console.log(message.trim()) } },
  admin: {
    user: "users",
    meta: { titleSuffix: " | Roofseal CMS" },
    importMap: { baseDir: path.resolve("."), importMapFile: path.resolve("src/app/(payload)/admin/importMap.ts") },
  },
  collections: [Users, Media, Categories, Products, Resources, Careers, Enquiries, EnquiryLimits],
  editor: lexicalEditor(),
  db: sqliteD1Adapter({ binding: env.D1, push: false }),
  plugins: [r2Storage({ bucket: env.R2, collections: { media: true } })],
  graphQL: { disable: true },
  typescript: { autoGenerate: false },
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
});
