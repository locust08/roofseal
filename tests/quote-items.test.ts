import assert from "node:assert/strict";
import { test } from "node:test";
import { parseQuoteItems } from "../src/cms/view-models";

test("quote persistence retains multiple distinct products and deduplicates IDs", () => {
  const first = { id: 1, title: "Deck762", slug: "roofseal-deck762", image: "/api/media/file/deck.png" };
  const second = { id: 2, title: "Euro762", slug: "roofseal-euro762", image: "/api/media/file/euro.png" };
  assert.deepEqual(parseQuoteItems(JSON.stringify([first, second, first])), [first, second]);
});

test("corrupt quote storage does not crash the website", () => {
  assert.deepEqual(parseQuoteItems("not-json"), []);
  assert.deepEqual(parseQuoteItems('{"id":1}'), []);
});

test("a stored quote cannot insert an external protocol-relative image", () => {
  const value = [{ id: 1, title: "Deck", slug: "deck", image: "//external.example/image.png" }];
  assert.deepEqual(parseQuoteItems(JSON.stringify(value)), []);
});
