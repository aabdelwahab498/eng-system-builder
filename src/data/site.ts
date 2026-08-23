export const site = {
  name: "Eng/Ahmed Abdelwahab",
  shortName: "A. Abdelwahab",
  role: "Software Engineer • AI Builder • Product Engineer",
  statement:
    "Building production-grade software, AI systems, and digital products.",
  domain: "https://nextnext-gen.com",
  description:
    "Portfolio of Eng/Ahmed Abdelwahab — software engineering, AI systems, backend architecture, and digital products.",
} as const;

export const ecosystem = {
  portfolio: { label: "Portfolio", url: "https://nextnext-gen.com" },
  factoryApi: {
    label: "Factory API",
    url: "https://factory-api.nextnext-gen.com",
    healthPath: "/health",
    status: "Operational",
  },
} as const;

export const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Products", to: "/products" },
  { label: "Engineering", to: "/engineering" },
  { label: "Contact", to: "/contact" },
] as const;

/** Configurable contact details. Leave a value empty to hide it. */
export const contact = {
  email: "",
  location: "",
  availability: "Open to product, backend and AI engineering work.",
} as const;

/** Configurable social links. Empty href entries are not rendered. */
export const socials: { label: string; href: string }[] = [
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "X", href: "" },
];
