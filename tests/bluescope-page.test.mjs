import assert from "node:assert/strict";
import test from "node:test";
import { splitMaterialContent } from "../src/components/sites/roofseal/materials/material-content.ts";

const textNode = (text) => ({ type: "text", text, version: 1 });
const paragraph = (text) => ({ type: "paragraph", children: [textNode(text)], version: 1 });
const heading = (text) => ({ type: "heading", tag: "h2", children: [textNode(text)], version: 1 });
const document = (children) => ({ root: { type: "root", children, version: 1, direction: "ltr", format: "", indent: 0 } });

test("CMS material sections retain all source nodes in their matching tab", () => {
  const nodes = [
    paragraph("Introduction with coating information"),
    heading("Metal Roofing Materials – Clean COLORBOND®"),
    paragraph("Clean COLORBOND information"),
    heading("Metal Roofing Materials – PRIMAMAJU® Steel"),
    paragraph("PRIMAMAJU information"),
    heading("Metal Roof Materials – BlueScope ZACS® Steel"),
    paragraph("ZACS information"),
  ];
  const source = document(nodes);
  const result = splitMaterialContent(source);
  assert.deepEqual(result.introduction.root.children, nodes.slice(0, 1));
  assert.deepEqual(result.sections.map((section) => section.content.root.children), [nodes.slice(1, 3), nodes.slice(3, 5), nodes.slice(5)]);
  assert.deepEqual(source.root.children, nodes, "Published CMS data is not mutated");
});

test("nested headings stay inside the current material section", () => {
  const result = splitMaterialContent(document([
    heading("Clean COLORBOND®"), paragraph("Product introduction"), heading("Applications"), paragraph("Roofing and walling"),
    heading("PRIMAMAJU®"), paragraph("Second product"),
  ]));
  assert.equal(result.introduction, null);
  assert.equal(result.sections[0].content.root.children.length, 4);
  assert.equal(result.sections[1].content.root.children.length, 2);
  assert.equal(result.sections[2].content, null);
});

test("missing CMS rich text still supplies all three original colour charts", () => {
  const result = splitMaterialContent(null);
  assert.equal(result.introduction, null);
  assert.equal(result.sections.length, 3);
  for (const section of result.sections) {
    assert.equal(section.content, null);
    assert.match(section.image, /^\/api\/media\/file\/.*\.jpg$/);
  }
});
