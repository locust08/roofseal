export type BuildingHotspot = {
  label: string;
  x: number;
  y: number;
  href: string;
  image: string;
  brand?: "roofseal" | "fixfas" | "sealframe";
};

/** Marker positions and names follow the approved BugHerd #35 diagram. */
export const buildingMarkers = [
  { label: "Glasswool", image: "glasswool", x: 514, y: 94, category: "glass-wool-insulation-supplier-malaysia" },
  { label: "Aluminium Foil", image: "aluminium-foil", x: 620, y: 94, category: "aluminium-foil-insulation-malaysia" },
  { label: "Trusses System", image: "trusses-system", x: 778, y: 134, product: "lightweight-steel-truss-system-malaysia" },
  { label: "Shingles Roof", image: "shingles-roof", x: 966, y: 436, category: "roof-shingles-system-malaysia" },
  { label: "Gutter System", image: "gutter-system", brand: "fixfas", x: 864, y: 436, category: "rain-gutter-systems-malaysia" },
  { label: "Skylight Roofing Sheet", image: "skylight-roofing-sheet", x: 554, y: 456, category: "skylights" },
  { label: "Metal Roof System", image: "metal-roof-system", brand: "roofseal", x: 463, y: 264, category: "metal-deck-roofing-sheets" },
  { label: "Fasteners", image: "fasteners", x: 386, y: 134, category: "fasteners" },
  { label: "C-Purlins", image: "c-purlins", x: 687, y: 163, product: "c-purlins" },
  { label: "Roofing Mesh", image: "roofing-mesh", x: 726, y: 94, category: "roofing-mesh" },
  { label: "Metal Door Frame", image: "metal-door-frame", brand: "sealframe", x: 645, y: 317, category: "metal-door-frames" },
] as const;
