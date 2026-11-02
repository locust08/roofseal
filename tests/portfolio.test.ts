import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getPortfolioDivision } from "../src/components/sites/roofseal/portfolio/projects";

test("portfolio matches the approved spreadsheet's 12 roofing and four door/frame projects", () => {
  const roof = getPortfolioDivision("metal-roof");
  const doors = getPortfolioDivision("metal-doors-frames");
  assert.equal(roof?.projects.length, 12);
  assert.equal(doors?.projects.length, 4);
  assert.ok(doors?.projects.some(p => p.title === "Adelia 2 Apartment"));
  assert.ok(!roof?.projects.some(p => p.title === "Adelia 2 Apartment"));
  assert.ok(roof?.projects.some(p => p.title === "Hitachi Plant" && p.location === "Bangi, Selangor"));
  for (const division of [roof!, doors!]) {
    assert.equal(new Set(division.projects.map(p => p.title)).size, division.projects.length);
    for (const project of division.projects) assert.ok(existsSync(path.join("public", project.image)), project.image);
  }
  assert.equal(getPortfolioDivision("unknown"), undefined);
});
