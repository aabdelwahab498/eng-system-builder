export type Product = {
  slug: string;
  name: string;
  type: string;
  description: string;
  status: "Coming Soon" | "Available";
  price: string;
  /** Configurable purchase / access link. Empty = button is disabled. */
  accessUrl?: string;
  details?: string[];
};

export const products: Product[] = [
  {
    slug: "najmah-story-experience",
    name: "Najmah Story Experience",
    type: "AI Product",
    description:
      "Personalized Arabic-first AI story creation, delivered as a digital product experience.",
    status: "Coming Soon",
    price: "TBA",
    accessUrl: "https://najmah.nextnext-gen.com",
    details: [
      "Arabic-first story generation",
      "Digital story exports",
      "Availability and pricing to be announced",
    ],
  },
  {
    slug: "factory-blueprints",
    name: "Factory Blueprints",
    type: "Engineering Toolkit",
    description:
      "Architecture blueprints and generation workflows extracted from the Universal AI Software Factory.",
    status: "Coming Soon",
    price: "TBA",
    details: ["Architecture templates", "Contract-first service structure", "Quality gate definitions"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
