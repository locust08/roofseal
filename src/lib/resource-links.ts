import type { Resource } from "@/payload-types";
import { mediaUrl } from "@/cms/view-models";

export const blogCategories = [
  { value: "article", label: "Articles", href: "/blogs/articles" },
  { value: "news", label: "News", href: "/blogs/news" },
  { value: "event", label: "Events", href: "/blogs/events" },
] as const;
export type BlogCategory = typeof blogCategories[number]["value"];
export const resourceNavigation = [
  { label: "Catalogues", href: "/catalogues" },
  { label: "Materials", href: "/materials-from-bluescope-malaysia" },
  ...blogCategories.map(({ label, href }) => ({ label, href })),
];
export function resourceHref(resource: Pick<Resource, "slug" | "type" | "file">): string {
  if (resource.type === "catalogue" && mediaUrl(resource.file)) return mediaUrl(resource.file);
  if (resource.slug === "bluescope-materials") return "/materials-from-bluescope-malaysia";
  return `/${resource.type === "article" ? "blogs" : "resources"}/${resource.slug}`;
}
