import path from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Categories, Media, Products, Resources, Users } from "./src/cms/collections";
import { Enquiries, EnquiryLimits } from "./src/enquiries/collections";

loadEnv({ path: [".env.local", ".env"], quiet: true });
const root = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.resolve(root, ".data"), { recursive: true });
if (!process.env.PAYLOAD_SECRET) {
  throw new Error("PAYLOAD_SECRET is missing. Run npm run cms:setup before starting Roofseal.");
}

export default buildConfig({
  telemetry: false,
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: "users",
    meta: { titleSuffix: " | Roofseal CMS" },
    importMap: { baseDir: root, importMapFile: path.resolve(root, "src/app/(payload)/admin/importMap.ts") },
  },
  collections: [Users, Media, Categories, Products, Resources, Enquiries, EnquiryLimits],
  editor: lexicalEditor(),
  sharp,
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || `file:${path.resolve(root, ".data/roofseal.db")}` },
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(root, "src/cms/migrations"),
    wal: true,
    busyTimeout: 10000,
  }),
  graphQL: { disable: true },
  // Generate explicitly with cms:types; background CLI children otherwise keep
  // isolated test processes alive and can rewrite source during a build.
  typescript: { autoGenerate: false, outputFile: path.resolve(root, "src/payload-types.ts") },
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
});
