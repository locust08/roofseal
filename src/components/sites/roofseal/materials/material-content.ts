import type { Resource } from "@/payload-types";

type MaterialRichText = NonNullable<Resource["content"]>;
type MaterialNode = MaterialRichText["root"]["children"][number];

export const materialTabs = [
  { id: "colorbond", label: "Clean COLORBOND®", image: "/api/media/file/aeddca06ea1e-colorbond-colors-scaled.jpg", alt: "Clean COLORBOND steel colour chart and product information" },
  { id: "primamaju", label: "PRIMAMAJU®", image: "/api/media/file/9b204b3d2050-Primamaju-colours-scaled.jpg", alt: "PRIMAMAJU steel colour chart and product information" },
  { id: "zacs", label: "BlueScope ZACS®", image: "/api/media/file/076b3a1a2d20-zacs-colors-scaled.jpg", alt: "BlueScope ZACS steel colour chart and product information" },
] as const;

function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  if ("text" in node && typeof node.text === "string") return node.text;
  if ("children" in node && Array.isArray(node.children)) return node.children.map(nodeText).join("");
  return "";
}

/** Keep the published rich text intact, grouping its material headings into tabs. */
export function splitMaterialContent(content: Resource["content"]) {
  const introduction: MaterialNode[] = [];
  const sections: Record<string, MaterialNode[]> = Object.fromEntries(materialTabs.map(({ id }) => [id, []]));
  let activeSection: string | undefined;

  for (const node of content?.root.children || []) {
    if (node.type === "heading") {
      const heading = nodeText(node).toUpperCase();
      const tab = materialTabs.find(({ id }) => heading.includes(id.toUpperCase()));
      if (tab) activeSection = tab.id;
    }
    (activeSection ? sections[activeSection] : introduction).push(node);
  }

  const richText = (children: MaterialNode[]): MaterialRichText | null => content && children.length
    ? { ...content, root: { ...content.root, children } }
    : null;

  return {
    introduction: richText(introduction),
    sections: materialTabs.map((tab) => ({ ...tab, content: richText(sections[tab.id]) })),
  };
}
