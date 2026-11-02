/** Supplied BugHerd #11–#13/#17/#21 copy, verified against the linked original pages. */
export type InformationColumn = {
  heading: string;
  emphasis: string;
  suffix?: string;
  paragraphs?: string[];
  bullets?: { label?: string; text: string }[];
  contact?: boolean;
};
export type SupportingContent = { sourceUrl: string; columns: [InformationColumn, InformationColumn] };

export const categorySupportingContent: Record<string, SupportingContent> = {
  "fire-rated-doors-supplier-malaysia": {
    sourceUrl: "https://www.roofseal.com.my/product-category/fire-rated-doors-supplier-malaysia/",
    columns: [
      { heading: "ACCESSORIES OF", emphasis: "FIRE-RATED DOOR", paragraphs: ["As a trusted fire-rated door supplier in Malaysia, our Fire-Rated Door comes with certificate and fire tags, and are tested and approved with a wide array of ironmongeries of renowned models and brands:"], bullets: [
        { text: "Panic Device" },
        { text: "Mortise lockset with lever handle" },
        { text: "Electronic card lock" },
        { text: "Heavy duty door closer" },
        { text: "Stainless steel hinges" },
        { text: "Auto bolt (For double leaves)" },
        { text: "Door selector (For double leaves)" },
      ] },
      { heading: "APPLICATIONS OF", emphasis: "FIRE-RATED DOOR", paragraphs: ["As a trusted fire-rated door supplier in Malaysia, our Fire-Rated Door can be applied to any commercial, industrial, government and domestic buildings such as:"], bullets: [
        { text: "Flats" },
        { text: "Hotels" },
        { text: "Factories" },
        { text: "Hospitals" },
        { text: "Apartments" },
        { text: "Shop Offices" },
        { text: "Office Blocks" },
        { text: "Condominiums" },
        { text: "Shopping Complex" },
      ], contact: true },
    ],
  },
  "glass-wool-insulation-supplier-malaysia": {
    sourceUrl: "https://www.roofseal.com.my/product-category/insulation/glass-wool-insulation-supplier-malaysia/",
    columns: [
      { heading: "BENEFITS OF", emphasis: "GLASS WOOL INSULATION", bullets: [
        { label: "Thermal Comfort", text: "Once incorporated into the roof, glass mineral wool insulation is the most efficient at adding thermal resistance because of their low thermal conductivity." },
        { label: "Sound Comfort", text: "Glass mineral wool insulation reduces air-borne sound transmission, impact sound transmission, and sound reverberation in specialist environment." },
        { label: "Fire Protection", text: "Glass mineral wool insulation are non-combustible and have excellent resistance to fire. Our glass wool is classified Class ‘O’ by BOMBA and can be used in a wide range of partitions, walls, ceilings and other building structures." },
        { label: "Indoor Air Quality", text: "Glass mineral wool insulation reduce everyday chemical exposure through the air we breathe in our homes, offices, schools and other indoor environments." },
      ] },
      { heading: "TYPES & APPLICATIONS OF", emphasis: "GLASS WOOL", paragraphs: ["As a trusted GLASS WOOL insulation supplier and stock keeper in Malaysia, we have the following GLASSWOOL products specifically for roofing applications:"], bullets: [
        { label: "Ecowool Classic Blanket", text: "It combines cost efficiency with the highest standard of insulation performance when installed under metal deck roofs (Type EWBL1.10, Density 10kg/m³)." },
        { label: "Ecowool Brownie Blanket", text: "It combines cost efficiency with the highest standard of insulation performance when installed under metal deck roofs (Type EWBL1.35 to EWBL 1.60, Density 16kg/m³ to 48kg/m³)." },
      ], contact: true },
    ],
  },
  "rockwool-insulation-supplier-malaysia": {
    sourceUrl: "https://www.roofseal.com.my/product-category/insulation/rockwool-insulation-supplier-malaysia/",
    columns: [
      { heading: "BENEFITS OF", emphasis: "ROCKWOOL INSULATION", bullets: [
        { label: "Superior fire resistance", text: "ROCKWOOL Stone wool products have naturally occurring and unmatched fire resilience qualities that will improve the fire resistance of any construction." },
        { label: "Excellent acoustics", text: "ROCKWOOL stone wool products are amongst the most effective acoustic insulation solutions used in construction." },
        { label: "A durable solution", text: "ROCKWOOL stone wool insulation won’t shrink, it won’t move and it won’t crumble. In fact, ROCKWOOL stone wool insulation is so durable; it will maintain its performance for the lifetime of a building." },
        { label: "Sustainable materials and production", text: "ROCKWOOL stone wool insulation is made from a sustainable material and produced in a sustainable way." },
      ] },
      { heading: "TYPES & APPLICATIONS OF", emphasis: "ROCKWOOL", paragraphs: ["As a trusted ROCKWOOL insulation supplier and stock keeper in Malaysia, we have the following ROCKWOOL products specifically for roofing applications:"], bullets: [
        { label: "Cool ‘n’ Comfort Roll Series", text: "Installed below the metal cladding sheet of a single skin roof system, held by reinforcing steel wire mesh and aluminium foil rolled over purlins." },
        { label: "Cool ‘n’ Comfort Slab Series", text: "Installed between two metal sheets in a double skin roofing system. The system is fixed together with a z-purlin which creates a gap for installation of the insulation and vapour barrier." },
      ], contact: true },
    ],
  },
  "aluminium-foil-insulation-malaysia": {
    sourceUrl: "https://www.roofseal.com.my/product-category/insulation/aluminium-foil-insulation-malaysia/",
    columns: [
      { heading: "IMPORTANCE OF", emphasis: "ALUMINIUM FOIL INSULATION", paragraphs: ["House insulation is crucial for maintaining a comfortable and energy-efficient living environment. Therefore, having aluminium foil insulation prevents external heat from entering the house, which in turn increases energy efficiency. Heat is not transmitted from the outside to the inside; therefore less energy is generated by the air-conditioning system to cool down the house. Aluminium foil insulation is also lightweight and malleable; hence its position under the roof will not exert pressure on the structure of the house. Proper home insulation enhances comfort and promotes environmental sustainability by reducing greenhouse gas emissions and reliance on fossil fuels."] },
      { heading: "FEATURES OF", emphasis: "ALUMINIUM FOIL INSULATION", paragraphs: ["The below is the list of features of our woven foil:"], bullets: [
        { text: "Up to 97% Radiant Heat Reflectivity" }, { text: "UV + Heat Stability" }, { text: "Lightweight" }, { text: "Moisture Barrier (WVTR)" }, { text: "Tear & Puncture Resistance" }, { text: "Energy Saving" }, { text: "SIRIM Certification" }, { text: "Bomba Certified (For FR Series)" },
      ], contact: true },
    ],
  },
  "rain-gutter-systems-malaysia": {
    sourceUrl: "https://www.roofseal.com.my/product-category/gutter-roof-component/rain-gutter-systems-malaysia/",
    columns: [
      { heading: "WHY", emphasis: "METAL RAIN GUTTER", suffix: "?", bullets: [
        { text: "Metal rain gutters can expand or contract in relation to the weather conditions" },
        { text: "Metal rain gutters take less damage from ultraviolet light exposure, thereby minimizing leakages" },
        { text: "Metal rain gutters have superior tolerance to various elements (rain, shine, rust, etc.) as they are very durable" },
        { text: "Metal rain gutters can have customized sizes, lengths and colours to suit every building’s different needs" },
        { text: "Metal rain gutters are durable and can last for many years with minimal maintenance" },
      ] },
      { heading: "WHY", emphasis: "UPVC RAIN GUTTER", suffix: "?", bullets: [
        { text: "UPVC rain gutters eliminates the need to paint and lesser chance of corrosion with time" },
        { text: "UPVC rain gutters are flexible and does not easily lose its shape" },
        { text: "UPVC rain gutters are less costly, lighter, convenient and easy to install" },
      ], contact: true },
    ],
  },
};
