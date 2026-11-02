import crypto, { type BinaryLike } from "node:crypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";

const bytes = (value: BinaryLike): Uint8Array => typeof value === "string"
  ? new TextEncoder().encode(value)
  : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

/** Preserve Payload's 600,000-round hashes above Workers' native PBKDF2 cap. */
export function payloadPbkdf2(password: BinaryLike, salt: BinaryLike, iterations: number, keyLength: number, digest: string, callback: (error: Error | null, hash: Buffer) => void): void {
  if (digest !== "sha256" || iterations <= 100000) {
    crypto.pbkdf2(password, salt, iterations, keyLength, digest, callback);
    return;
  }
  void pbkdf2Async(sha256, bytes(password), bytes(salt), { c: iterations, dkLen: keyLength })
    .then((hash) => callback(null, Buffer.from(hash)))
    .catch((error: unknown) => callback(error instanceof Error ? error : new Error("Password hashing failed"), Buffer.alloc(0)));
}

// Only Payload auth imports are redirected here in the Cloudflare build.
// Randomness, timing-safe comparison and all other operations remain native.
const payloadCrypto = { ...crypto, pbkdf2: payloadPbkdf2 };
export default payloadCrypto;
