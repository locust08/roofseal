import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { mediaFilename, verifyMedia } from "./media-files";

type Source = { url: string; alt: string };
export type Download = Source & { filename: string; path: string; mimeType: string; checksum: string; bytes: number };
const sources: Source[] = JSON.parse(await readFile("data/roofseal-source/media.json", "utf8"));
const folder = ".data/source-media";
await mkdir(folder, { recursive: true });
const results: Download[] = [];
const failures: { url: string; error: string }[] = [];
let index = 0;
async function worker() {
  while (index < sources.length) {
    const source = sources[index++];
    const filename = mediaFilename(source.url);
    const localPath = path.join(folder, filename);
    try {
      let bytes: Buffer | undefined;
      try {
        bytes = await readFile(localPath);
        verifyMedia(bytes, filename);
      } catch {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            if (source.url.startsWith("local:")) {
              bytes = await readFile(path.join("public", source.url.slice(6)));
            } else {
              const response = await fetch(source.url, { signal: AbortSignal.timeout(45000) });
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              bytes = Buffer.from(await response.arrayBuffer());
            }
            verifyMedia(bytes, filename);
            if (!filename.toLowerCase().endsWith(".pdf")) await sharp(bytes).metadata();
            await writeFile(localPath, bytes);
            break;
          } catch (error) {
            if (attempt === 2) throw error;
          }
        }
      }
      if (!bytes) throw new Error("Empty media response");
      results.push({ ...source, filename, path: localPath, mimeType: verifyMedia(bytes, filename), checksum: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length });
      console.log(`Downloaded ${results.length}/${sources.length}: ${filename}`);
    } catch (error) {
      failures.push({ url: source.url, error: String(error) });
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
results.sort((a, b) => a.url.localeCompare(b.url));
await writeFile(".data/download-manifest.json", JSON.stringify(results, null, 2));
await writeFile(".data/download-failures.json", JSON.stringify(failures, null, 2));
console.log(`${results.length} verified files; ${failures.length} failures.`);
if (failures.length) process.exitCode = 1;
