import assert from "node:assert/strict";
import { test } from "node:test";
import { getPlatformProxy } from "wrangler";
import type { SQLiteAdapterArgs } from "@payloadcms/db-d1-sqlite";
import { executeSql } from "../src/enquiries/sql";

test("D1 atomically limits concurrent submissions and claims each delivery once", async () => {
  const platform = await getPlatformProxy<{ D1: SQLiteAdapterArgs["binding"] }>({ persist: false });
  try {
    const db = platform.env.D1;
    await executeSql(db, { sql: "CREATE TABLE rate_test (key TEXT PRIMARY KEY, count INTEGER)", args: [] });
    const slots = await Promise.all(Array.from({ length: 12 }, () => executeSql(db, {
      sql: "INSERT INTO rate_test (key, count) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING key",
      args: ["same-visitor"],
    })));
    assert.equal(slots.filter((result) => result.rows.length).length, 5);
    await executeSql(db, { sql: "CREATE TABLE delivery_test (id INTEGER PRIMARY KEY, status TEXT)", args: [] });
    await executeSql(db, { sql: "INSERT INTO delivery_test VALUES (?, ?)", args: [1, "pending"] });
    const claims = await Promise.all(Array.from({ length: 8 }, () => executeSql(db, {
      sql: "UPDATE delivery_test SET status = ? WHERE id = ? AND status = ? RETURNING id", args: ["sending", 1, "pending"],
    })));
    assert.equal(claims.filter((result) => result.rows.length).length, 1);
    const finished = await executeSql(db, { sql: "UPDATE delivery_test SET status = ? WHERE id = ? AND status = ?", args: ["sent", 1, "sending"] });
    assert.equal(finished.rowsAffected, 1);
  } finally {
    await platform.dispose();
  }
});
