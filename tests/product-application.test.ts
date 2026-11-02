import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProductApplication } from "../src/cms/product-application";

const valid = { sourceUrl: "https://www.roofseal.com.my/product/clip-fixing-ds-525-ph/", image: "/sites/roofseal/fasteners/Fastener-Clip-Fixing.jpg", imageAlt: "Clip fixing application", imageWidth: 240, imageHeight: 180, columns: ["Purlin", "Light gauge"], rows: [["DS 525 PH", "DS 525 SS PH"]] };
test("application tables preserve column mappings and accept optional empty CMS content", () => {
  assert.deepEqual(parseProductApplication(valid), valid);
  assert.equal(parseProductApplication(undefined), null);
  assert.equal(parseProductApplication(null), null);
});
test("invalid table shapes and unsafe diagram sources cannot reach the product template", () => {
  for (const changed of [{ rows: [["Only one cell"]] }, { image: "https://example.com/tracker.jpg" }, { image: "/sites/roofseal/fasteners/../../private.jpg" }, { imageWidth: -1 }, { columns: [] }, { rows: [] }]) {
    assert.equal(parseProductApplication({ ...valid, ...changed }), null);
  }
});
