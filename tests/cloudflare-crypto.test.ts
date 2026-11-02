import assert from "node:assert/strict";
import { pbkdf2Sync } from "node:crypto";
import { test } from "node:test";
import { payloadPbkdf2 } from "../src/cms/cloudflare-crypto";

const hash = (password: string | Buffer, salt: string | Buffer, iterations: number, length: number) =>
  new Promise<Buffer>((resolve, reject) => payloadPbkdf2(password, salt, iterations, length, "sha256", (error, value) => error ? reject(error) : resolve(value)));

test("Workers password hashing matches existing Payload 600,000-round hashes exactly", async () => {
  for (const password of ["test-only-password", "Fixture-屋顶-☀️"]) {
    const salt = "fixture-salt";
    assert.deepEqual(await hash(password, salt, 600000, 32), pbkdf2Sync(password, salt, 600000, 32, "sha256"));
  }
  assert.notDeepEqual(await hash("wrong-password", "fixture-salt", 600000, 32), await hash("test-only-password", "fixture-salt", 600000, 32));
});

test("legacy Payload password hashes and binary inputs remain compatible", async () => {
  const password = Buffer.from([0, 128, 255, 42]);
  const salt = Buffer.from([10, 0, 250]);
  for (const [iterations, length] of [[25000, 512], [100001, 32]]) {
    assert.deepEqual(await hash(password, salt, iterations, length), pbkdf2Sync(password, salt, iterations, length, "sha256"));
  }
});
