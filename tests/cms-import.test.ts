import assert from "node:assert/strict";
import { test } from "node:test";
import { mediaFilename, verifyMedia } from "../scripts/cms/media-files";

test("media filenames distinguish different source paths without unsafe characters", () => {
  const first = mediaFilename("https://www.roofseal.com.my/wp-content/uploads/Deck%20762.png");
  assert.match(first, /^[a-f0-9]{12}-Deck-762\.png$/);
  assert.notEqual(first, mediaFilename("https://www.roofseal.com.my/other/Deck%20762.png"));
});

test("an HTML error response is rejected instead of imported as a PDF", () => {
  assert.throws(() => verifyMedia(Buffer.from("<!doctype html>Not found"), "catalogue.pdf"), /PDF/);
});

test("an HTML error response is rejected instead of imported as an image", () => {
  assert.throws(() => verifyMedia(Buffer.from("<html>Not found</html>"), "image.png"), /image/);
});

test("PDF bytes and PNG bytes are identified independently of response headers", () => {
  assert.equal(verifyMedia(Buffer.from("%PDF-1.7\n"), "catalogue.pdf"), "application/pdf");
  assert.equal(verifyMedia(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "image.png"), "image/png");
});
