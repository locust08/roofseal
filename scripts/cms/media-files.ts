import { createHash } from "node:crypto";
import path from "node:path";

export function mediaFilename(source: string): string {
  const filename = decodeURIComponent(path.basename(new URL(source).pathname))
    .replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120);
  return `${createHash("sha256").update(source).digest("hex").slice(0, 12)}-${filename}`;
}

export function verifyMedia(bytes: Buffer, filename: string): string {
  if (filename.toLowerCase().endsWith(".pdf")) {
    if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error(`Invalid PDF: ${filename}`);
    return "application/pdf";
  }
  if (bytes[0] === 0x89 && bytes.subarray(1, 4).toString() === "PNG") return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.subarray(0, 3).toString() === "GIF") return "image/gif";
  if (bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") return "image/webp";
  throw new Error(`Invalid image: ${filename}`);
}
