import assert from "node:assert/strict";
import { test } from "node:test";
import { stackBounds, projectCardPose, CARD_PERSPECTIVE } from "../src/components/sites/roofseal/home/motion/card-swap-geometry";

test("the prototype stack fits two full-size 800x600 cards with a 100px offset and no inset", () => {
  assert.deepEqual(stackBounds({ width: 800, height: 600, cardDistance: 100, verticalDistance: -100, depth: 100, skewAmount: 0, visible: 2, hoverSpread: 0, padding: 0, preserveCardSize: true }), {
    width: 900, height: 700, originX: 400, originY: 300,
  });
});

test("perspective compensation keeps both prototype button centres and diameters exact", () => {
  for (const [pose, expected] of [
    [{ x: 0, y: 0, z: 0 }, { centreX: 1710, centreY: 710 }],
    [{ x: 100, y: 100, z: -100 }, { centreX: 1810, centreY: 810 }],
  ] as const) {
    const actual = projectCardPose(pose, true);
    const perspectiveScale = CARD_PERSPECTIVE / (CARD_PERSPECTIVE - pose.z);
    const centreX = 970 + 400 + (actual.x + (740 - 400) * actual.scale) * perspectiveScale;
    const centreY = 170 + 300 + (actual.y + (540 - 300) * actual.scale) * perspectiveScale;
    assert.ok(Math.abs(centreX - expected.centreX) < 0.001);
    assert.ok(Math.abs(centreY - expected.centreY) < 0.001);
    assert.ok(Math.abs(60 * actual.scale * perspectiveScale - 60) < 0.001);
  }
});

test("ordinary decks retain perspective depth and the default safety padding", () => {
  const bounds = stackBounds({ width: 800, height: 600, cardDistance: 100, verticalDistance: -100, depth: 100, skewAmount: 0, visible: 2, hoverSpread: 0 });
  assert.deepEqual(bounds, { width: 914, height: 724, originX: 432, originY: 332 });
  assert.deepEqual(projectCardPose({ x: 100, y: 100, z: -100 }, false), { x: 100, y: 100, scale: 1 });
});
