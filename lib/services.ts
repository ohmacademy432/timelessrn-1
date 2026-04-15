// ─── Timeless RN Services Catalog ───

export type ServiceCategory = "IV" | "PRP" | "AESTHETIC";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  short: string;
  description: string;
  price?: string;
  benefits: string[];
};

export const SERVICES: Service[] = [
  // ─── IV THERAPY ───
  {
    id: "iv-hydration",
    category: "IV",
    name: "IV Hydration Therapy",
    short: "Replenish fluids and electrolytes",
    description:
      "Replenish fluids and electrolytes for hydration, recovery, and performance. Our IV hydration therapy delivers a balanced blend of saline and essential electrolytes directly into the bloodstream for maximum absorption.",
    benefits: [
      "Rapid rehydration",
      "Improved energy and recovery",
      "Athletic performance support",
      "Hangover and fatigue relief",
    ],
  },
  {
    id: "nad",
    category: "IV",
    name: "NAD+ Infusions",
    short: "Boost cellular energy and longevity",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme vital to cellular energy production, DNA repair, and healthy aging. Our NAD+ infusions support cognitive function, mental clarity, and longevity.",
    benefits: [
      "Increased cellular energy",
      "Improved cognitive function",
      "Anti-aging support",
      "DNA repair assistance",
    ],
  },
  {
    id: "glutathione",
    category: "IV",
    name: "Glutathione Therapy",
    short: "Your body's master antioxidant",
    description:
      "Glutathione is the body's master antioxidant — supporting detoxification, immunity, and skin health. IV delivery ensures maximum bioavailability for full-body benefits.",
    benefits: [
      "Powerful detoxification",
      "Skin brightening and clarity",
      "Immune system support",
      "Anti-inflammatory benefits",
    ],
  },
  {
    id: "vitamin-c",
    category: "IV",
    name: "Vitamin C Infusions",
    short: "Immune and collagen support",
    description:
      "High-dose Vitamin C infusions deliver immune support, collagen formation, and anti-inflammatory benefits well beyond what oral supplementation can achieve.",
    benefits: [
      "Immune system boost",
      "Collagen production",
      "Anti-inflammatory action",
      "Antioxidant protection",
    ],
  },
  {
    id: "custom-iv",
    category: "IV",
    name: "Custom IV Vitamin & Supplement Blends",
    short: "Tailored to your wellness goals",
    description:
      "Custom-blended IV therapies tailored to your lifestyle and health goals. Work with our RN team to design a formula that targets your specific needs.",
    benefits: [
      "Personalized formulation",
      "Targeted wellness support",
      "Nurse-guided protocol",
      "Flexible add-ons available",
    ],
  },
  {
    id: "add-ons",
    category: "IV",
    name: "Wellness Add-Ons",
    short: "Targeted nutrient support",
    description:
      "Add targeted minerals, amino acids, and nutrients to any IV therapy — including B-complex, magnesium, zinc, taurine, and more.",
    benefits: [
      "Customize any infusion",
      "Clinical-grade ingredients",
      "Affordable enhancements",
      "Nurse-recommended blends",
    ],
  },

  // ─── PRP ───
  {
    id: "prp-facial",
    category: "PRP",
    name: "Platelet Rich Plasma Facial",
    short: "Microneedling with your own plasma",
    description:
      "PRP microneedling combines the rejuvenating power of your own platelet-rich plasma with precision microneedling for improved skin texture, reduced fine lines, and a rejuvenated appearance.",
    price: "$299",
    benefits: [
      "Improved skin texture",
      "Reduced fine lines",
      "Natural collagen induction",
      "Brighter, firmer complexion",
    ],
  },
  {
    id: "prp-hair",
    category: "PRP",
    name: "PRP Hair Growth",
    short: "Non-surgical hair restoration",
    description:
      "A non-surgical solution for hair loss using your own blood's growth factors to stimulate dormant hair follicles and support natural hair regrowth.",
    price: "$249",
    benefits: [
      "Stimulates hair follicles",
      "Non-surgical treatment",
      "Uses your own growth factors",
      "Thicker, fuller hair over time",
    ],
  },
  {
    id: "prp-joint",
    category: "PRP",
    name: "PRP Joint Injection",
    short: "Regenerative joint therapy",
    description:
      "Regenerative treatment for knee, shoulder, or hip pain using concentrated platelets to support natural tissue healing and reduce chronic joint pain.",
    price: "$249",
    benefits: [
      "Reduces joint pain",
      "Supports tissue repair",
      "Non-surgical alternative",
      "Drug-free pain relief",
    ],
  },

  // ─── AESTHETIC ───
  {
    id: "rf-microneedling",
    category: "AESTHETIC",
    name: "Radio Frequency Microneedling with PRP",
    short: "Advanced skin rejuvenation",
    description:
      "Advanced skin rejuvenation combining microneedling with radio frequency energy and platelet-rich plasma — the gold standard for tightening, scar revision, and deep collagen remodeling.",
    benefits: [
      "Skin tightening",
      "Scar and pore reduction",
      "Deep collagen remodeling",
      "Minimal downtime",
    ],
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getServicesByCategory(c: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === c);
}

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  IV: "IV THERAPY",
  PRP: "PRP TREATMENTS",
  AESTHETIC: "AESTHETIC",
};
