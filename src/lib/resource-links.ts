import type { Resource } from "@/payload-types";

export const blogCategories = [
  { value: "article", label: "Articles", href: "/articles" },
  { value: "news", label: "News", href: "/news" },
  { value: "event", label: "Events", href: "/events" },
] as const;
export type BlogCategory = typeof blogCategories[number]["value"];
export const resourceNavigation = [
  { label: "Catalogues", href: "/catalogues" },
  { label: "Materials", href: "/materials" },
  ...blogCategories.map(({ label, href }) => ({ label, href })),
];
export function resourceHref(resource: Pick<Resource, "slug" | "type">): string {
  if (resource.slug === "bluescope-materials") return "/bluescope-materials";
  return `/${resource.type === "article" ? "blogs" : "resources"}/${resource.slug}`;
}
