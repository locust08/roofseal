import { getCategories, getProductCards } from "./cms-content";
import { categoryHref } from "@/cms/view-models";
import { buildingMarkers, type BuildingHotspot } from "@/components/sites/roofseal/home/building-hotspots";

export async function getHomeHotspots(): Promise<BuildingHotspot[]> {
  const [categories, products] = await Promise.all([getCategories(), getProductCards()]);
  return buildingMarkers.flatMap<BuildingHotspot>((marker) => {
    // Artwork follows BugHerd #46; destinations still require published CMS records.
    const artwork = { image: `/sites/roofseal/hotspots/${marker.image}.webp`, ...("brand" in marker ? { brand: marker.brand } : {}) };
    if ("category" in marker) {
      const category = categories.find((item) => item.slug === marker.category);
      return category ? [{ label: marker.label, x: marker.x, y: marker.y, href: categoryHref(category.slug), ...artwork }] : [];
    }
    const product = products.find((item) => item.slug === marker.product);
    return product ? [{ label: marker.label, x: marker.x, y: marker.y, href: product.href, ...artwork }] : [];
  });
}
