import type { IconName } from "@/components/icons";

/* ------------------------------------------------------------------------ */
/* Site                                                                      */
/* ------------------------------------------------------------------------ */

export const site = {
  name: "Jnros Logistics",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jnroslogistics.com",
  tagline: "Engineered Logistics for Complex Cargo",
  description:
    "Jnros Logistics delivers engineered logistics across sea, air and inland transport, specialising in Project Cargo, EPC logistics, Breakbulk, ODC, OOG and Heavy Lift, plus global air and ocean freight, customs clearance and warehousing.",
  phone: "+91 96202 32321",
  phoneHref: "tel:+919620232321",
  whatsappNumber: "919620232321",
  email: "nesan.kumar@jnroslogistics.com",
  address: {
    lines: [
      "G006 Aditya Sunshine, Chickkabanaswadi Main Road",
      "Opp. CMR Law College, Kalyanagar Post",
      "Bangalore – 560043",
    ],
    locality: "Bangalore",
    region: "Karnataka",
    postalCode: "560043",
    country: "IN",
  },
  mapEmbedUrl:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Aditya Sunshine, Chikkabanaswadi Main Road, Kalyan Nagar, Bengaluru, Karnataka 560043") +
    "&output=embed",
};

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Leave href empty to hide an icon. The live site has no Facebook/Instagram/YouTube URLs yet. */
export const socialLinks: { label: string; icon: "whatsapp" | "facebook" | "instagram" | "youtube" | "linkedin"; href: string }[] = [
  { label: "WhatsApp", icon: "whatsapp", href: whatsappUrl() },
  { label: "Facebook", icon: "facebook", href: "" },
  { label: "Instagram", icon: "instagram", href: "" },
  { label: "YouTube", icon: "youtube", href: "" },
];

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------------ */
/* Images (all remote, served through next/image)                            */
/* ------------------------------------------------------------------------ */

export type SiteImage = { src: string; width: number; height: number; alt: string };

const UPLOADS = "https://jnroslogistics.com/wp-content/uploads/2026/02/";
const img = (file: string, width: number, height: number, alt: string): SiteImage => ({
  src: UPLOADS + file,
  width,
  height,
  alt,
});

export const images = {
  hero: img(
    "industrial-container-cargo-freight-ship-habor-logistic-import-export_1150-18279.avif",
    740,
    493,
    "Container ship berthed beneath gantry cranes at a port terminal at dusk",
  ),
  about: img(
    "1699968975183.jpg",
    792,
    594,
    "Large cylindrical pressure vessel loaded on a multi-axle hydraulic trailer at a port",
  ),
  odc: img(
    "New-Project-2026-02-17T115540.232.jpg",
    740,
    493,
    "Over-dimensional reactor vessel on a multi-axle trailer hauled by a prime mover",
  ),
  breakBulk: img(
    "New-Project-2026-02-17T114845.307.jpg",
    740,
    493,
    "Ship cranes loading long break bulk cargo onto a vessel deck in port",
  ),
  roRo: img(
    "New-Project-2026-02-17T114639.570.jpg",
    740,
    493,
    "Truck and trailer driving up the stern ramp of a Ro-Ro vessel",
  ),
  bulkCarrier: img(
    "New-Project-2026-02-17T120403.681.jpg",
    740,
    493,
    "Bulk carrier with deck cranes moored alongside a port",
  ),
  ctaBanner: img(
    "how_long_does_it_take_to_unload_a_container_ship.png",
    719,
    377,
    "Ship-to-shore crane lifting a container beside stacked containers on a vessel",
  ),
} satisfies Record<string, SiteImage>;

/** Keep this order. */
export const gallery: SiteImage[] = [
  img("WhatsApp-Image-2026-02-24-at-4.30.15-PM-2.jpeg", 320, 240, "Yellow mining dump trucks lined up at a staging yard before loading"),
  img("WhatsApp-Image-2026-02-24-at-4.30.16-PM-1.jpeg", 640, 480, "BH50M mining dump trucks parked on the deck of a barge"),
  img("WhatsApp-Image-2026-02-24-at-4.30.16-PM-2.jpeg", 640, 480, "Dump truck wheels on a barge deck alongside a vessel hull"),
  img("WhatsApp-Image-2026-02-24-at-4.30.17-PM.jpeg", 640, 480, "Crew member standing in front of mining dump trucks secured on a barge"),
  img("WhatsApp-Image-2026-02-24-at-4.30.17-PM-2-Copy.jpeg", 640, 480, "Row of yellow dump trucks on a barge on open water"),
  img("WhatsApp-Image-2026-02-24-at-4.30.18-PM.jpeg", 640, 480, "BH50M dump trucks lashed in a row on a barge deck"),
  img("WhatsApp-Image-2026-02-24-at-4.30.17-PM-1.jpeg", 640, 480, "Lashing chains securing dump trucks on a barge deck at sea"),
  img("WhatsApp-Image-2026-02-24-at-4.30.16-PM.jpeg", 640, 480, "Barge carrying yellow dump trucks on a river, seen from the bank"),
  img("WhatsApp-Image-2026-02-24-at-4.30.14-PM.jpeg", 478, 640, "Dump truck lifted by crane during a night-time loading operation"),
];

/* ------------------------------------------------------------------------ */
/* Home                                                                      */
/* ------------------------------------------------------------------------ */

export const hero = {
  title: "Engineered Logistics for Complex Cargo",
  subtitles: [
    "Delivering Precision Across Global Trade Routes",
    "Moving Industrial Cargo, Powering Progress",
    "Where Technical Expertise Meets Global Reach",
  ],
  coordinates: "12.97°N 77.59°E — BANGALORE, IN",
};

export const marqueeItems = ["ODC", "Breakbulk", "Heavy Lift", "Project Cargo", "Ro-Ro", "Air Charter"];

export const about = {
  title: "About Jnros Logistics",
  /** Scroll-highlighted word by word. */
  lead: "Jnros Logistics is a specialised logistics partner with strong expertise in Project Cargo, EPC logistics, Breakbulk, ODC and Heavy Lift operations, handling complex, oversized and heavy-duty industrial cargo across major global trade routes.",
  body: "We move secure, time-sensitive cargo by international air freight, global air charter and ocean transport, with a particular focus on Out-of-Gauge (OOG) cargo, heavy lift consignments and multi-package project movements. Every shipment is engineered for technical compliance and operational efficiency.",
  strengths: ["Project Cargo", "EPC Logistics", "Breakbulk", "ODC", "OOG", "Heavy Lift"],
};

/** Section eyebrows, in page order. */
export const eyebrows = {
  about: "01 / About",
  specialisations: "02 / Specialisations",
  network: "03 / Network",
  services: "04 / Services",
  process: "05 / Process",
  projects: "06 / Projects",
  why: "07 / Why us",
};

/** Placeholder figures: confirm before launch. */
export const stats = [
  { value: 150, suffix: "+", label: "Clients" },
  { value: 10, suffix: "+", label: "Years experience" },
  { value: 40, suffix: "+", label: "Countries" },
  { value: 500, suffix: "+", label: "Projects" },
];

/* ------------------------------------------------------------------------ */
/* Solutions & services (16)                                                 */
/* ------------------------------------------------------------------------ */

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  /** Pre-selects the cargo type on the quote form. */
  cargoType?: string;
  /** Specialisations shown as photo cards on the home page. */
  image?: SiteImage;
};

export const solutions: Service[] = [
  {
    slug: "odc-cargo-shipping",
    title: "ODC Cargo Shipping",
    description: "Safe, compliant movement of over-dimensional and heavy cargo with detailed planning and specialised equipment.",
    icon: "Ruler",
    cargoType: "ODC / Over-dimensional cargo",
    image: images.odc,
  },
  {
    slug: "break-bulk-shipping",
    title: "Break Bulk Shipping",
    description: "Efficient handling and shipping of non-containerised cargo with secure loading and global coordination.",
    icon: "Boxes",
    cargoType: "Break bulk",
    image: images.breakBulk,
  },
  {
    slug: "ro-ro-shipping",
    title: "Ro-Ro Shipping",
    description: "Reliable roll-on/roll-off shipping for vehicles and wheeled machinery, with smooth port operations.",
    icon: "CarFront",
    cargoType: "Ro-Ro (vehicles & wheeled machinery)",
    image: images.roRo,
  },
  {
    slug: "bulk-carrier-shipping",
    title: "Bulk Carrier Shipping",
    description: "Bulk carrier solutions for coal, rice, grains, minerals and other dry bulk commodities.",
    icon: "Ship",
    cargoType: "Dry bulk",
    image: images.bulkCarrier,
  },
  {
    slug: "ship-brokering",
    title: "Ship Brokering",
    description: "Vessel sourcing and charter negotiation matched to your cargo and trade route.",
    icon: "Handshake",
  },
  {
    slug: "heavy-lift-chartering-industrial-movers",
    title: "Heavy Lift Chartering & Industrial Movers",
    description: "Vessel chartering and industrial relocation for heavy machinery and large-scale equipment.",
    icon: "Factory",
    cargoType: "Heavy lift",
  },
  {
    slug: "heavy-cargo-loadout-operations",
    title: "Heavy Cargo Loadout Operations",
    description: "Complex loadouts from shore to barge or vessel, executed under strict safety control.",
    icon: "Anchor",
    cargoType: "Heavy lift",
  },
  {
    slug: "heavy-lifting-transportation",
    title: "Heavy Lifting & Transportation",
    description: "Precision lifting and secure transport for oversized, high-tonnage cargo.",
    icon: "Weight",
    cargoType: "Heavy lift",
  },
];

export const services: Service[] = [
  {
    slug: "international-air-freight",
    title: "International Air Freight",
    description: "Fast, secure air freight for time-critical and high-value shipments, with seamless global connections.",
    icon: "Plane",
    cargoType: "Air freight",
  },
  {
    slug: "global-air-charter",
    title: "Global Air Charter",
    description: "Dedicated aircraft for oversized, urgent and specialised cargo, with charter planning handled end to end.",
    icon: "PlaneTakeoff",
    cargoType: "Air freight",
  },
  {
    slug: "international-ocean-freight",
    title: "International Ocean Freight",
    description: "Cost-effective ocean freight for containerised, break bulk and project cargo on global trade routes.",
    icon: "Container",
    cargoType: "Containerised (FCL / LCL)",
  },
  {
    slug: "overland-transport",
    title: "Overland Transport",
    description: "Domestic and cross-border road transport with planned routes for secure, on-time delivery.",
    icon: "Truck",
  },
  {
    slug: "warehousing-and-distribution",
    title: "Warehousing & Distribution",
    description: "Secure storage, inventory management and timely distribution that scale with your supply chain.",
    icon: "Warehouse",
  },
  {
    slug: "dangerous-goods-handling",
    title: "Dangerous Goods Handling",
    description: "Dangerous goods handled to international safety regulations, with correct packaging and documentation.",
    icon: "FlaskConical",
    cargoType: "Dangerous goods",
  },
  {
    slug: "customs-clearance",
    title: "Customs Clearance",
    description: "Accurate documentation and regulatory compliance for smooth import and export clearance.",
    icon: "FileCheck",
  },
  {
    slug: "project-and-heavy-cargo",
    title: "Project & Heavy Cargo",
    description: "Detailed planning and specialised equipment for oversized machinery and industrial shipments.",
    icon: "Forklift",
    cargoType: "Project / EPC cargo",
  },
];

export const specialisations = solutions.filter((s): s is Service & { image: SiteImage } => Boolean(s.image));

export const sectionIntros = {
  specialisations:
    "Oversized, non-containerised and dry bulk cargo, moved with precision, safety and global coordination.",
  services:
    "From air and ocean freight to overland transport, warehousing and customs clearance, we coordinate every stage with a focus on safety, compliance and on-time delivery.",
  solutions:
    "Project logistics for oversized, high-value and technically demanding cargo. We plan every phase, from route analysis to final placement, and work alongside carriers, ports and authorities to deliver safely across sea, air and land.",
  gallery:
    "Recent project cargo moves by our team, including a fleet of mining dump trucks shipped by barge.",
};

export const whyChooseUs = {
  title: "Why Choose Us",
  paragraphs: [
    "We deliver engineered logistics across sea, air and inland transport, focused on Project Cargo, Breakbulk, ODC and Heavy Lift movements, alongside structured air and ocean freight forwarding.",
    "Customs clearance, transport engineering and specialised cargo handling come together under one team, so every movement is safe, compliant and on time from origin to final destination.",
  ],
  features: [
    {
      icon: "Globe",
      title: "Global & Local Expertise",
      description:
        "Our team handles international compliance and local nuances, giving you a global solution that understands local context.",
    },
    {
      icon: "Layers",
      title: "Integrated Logistics Services",
      description:
        "We manage every part of transport and logistics end to end, reducing costs and improving delivery times.",
    },
    {
      icon: "Settings2",
      title: "Customised Service Offerings",
      description:
        "Services shaped around your business, so your cargo is handled efficiently, safely and in line with every regulation.",
    },
  ] satisfies { icon: IconName; title: string; description: string }[],
};

/* ------------------------------------------------------------------------ */
/* Network map                                                               */
/* ------------------------------------------------------------------------ */

export type RouteStop = {
  key: "dubai" | "rotterdam" | "singapore" | "shanghai" | "houston" | "durban";
  city: string;
  country: string;
  mode: "sea" | "air";
  /** Put the map label under the dot (Singapore sits right next to the origin label). */
  labelBelow?: boolean;
};

export const network = {
  title: "Global Routes, Engineered from India",
  intro: "From our base in South India, we coordinate project and heavy cargo along the trade lanes our clients depend on.",
  origin: { key: "chennai" as const, label: "Chennai / Bangalore", country: "India" },
  routes: [
    { key: "dubai", city: "Dubai", country: "UAE", mode: "sea" },
    { key: "rotterdam", city: "Rotterdam", country: "Netherlands", mode: "sea" },
    { key: "singapore", city: "Singapore", country: "Singapore", mode: "air", labelBelow: true },
    { key: "shanghai", city: "Shanghai", country: "China", mode: "sea" },
    { key: "houston", city: "Houston", country: "USA", mode: "air" },
    { key: "durban", city: "Durban", country: "South Africa", mode: "sea" },
  ] satisfies RouteStop[],
};

/* ------------------------------------------------------------------------ */
/* Process                                                                   */
/* ------------------------------------------------------------------------ */

export const howWeWork = {
  title: "How We Work",
  intro: "From initial assessment to final placement, every move follows the same disciplined sequence.",
  steps: [
    {
      title: "Cargo assessment",
      description:
        "We review dimensions, weights, drawings and deadlines to understand exactly what has to move and the constraints around it.",
    },
    {
      title: "Route survey & engineering",
      description:
        "Route surveys, lifting plans and load calculations decide the vessel, trailer and lifting equipment for every package.",
    },
    {
      title: "Permits, documents & customs",
      description:
        "We prepare permits, shipping documents and customs filings so cargo clears ports and borders without delay.",
    },
    {
      title: "Loading, lashing & transport",
      description:
        "Our team supervises loadout, lashing and sea fastening, then manages the move across sea, air or road.",
    },
    {
      title: "Delivery & final placement",
      description: "Cargo is delivered, unloaded and placed at site, with updates at every stage through to handover.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Projects                                                                  */
/* ------------------------------------------------------------------------ */

/*
 * All nine photos come from one recent job: a fleet of BH50M mining dump trucks shipped by barge.
 * They are grouped by operation stage. Add new projects here as they are documented.
 */
export const projectStages = ["Loading", "Lashing", "Transit"] as const;
export type ProjectStage = (typeof projectStages)[number];
export type ProjectPhoto = { title: string; stage: ProjectStage; image: SiteImage };

export const featuredProject = {
  title: "BH50M mining fleet by barge",
  intro: "One recent move, start to finish: a fleet of BH50M mining dump trucks staged, loaded, lashed and shipped by barge to site.",
};

export const projectPhotos: ProjectPhoto[] = [
  { title: "Fleet staging before loadout", stage: "Loading", image: gallery[0] },
  { title: "Trucks on the barge deck", stage: "Loading", image: gallery[1] },
  { title: "Positioning alongside the vessel", stage: "Loading", image: gallery[2] },
  { title: "Final checks on deck", stage: "Lashing", image: gallery[3] },
  { title: "Underway on open water", stage: "Transit", image: gallery[4] },
  { title: "Trucks lashed in line", stage: "Lashing", image: gallery[5] },
  { title: "Chain lashing at sea", stage: "Lashing", image: gallery[6] },
  { title: "River leg to site", stage: "Transit", image: gallery[7] },
  { title: "Night crane lift", stage: "Loading", image: gallery[8] },
];

/** The hover list on the home page tells the job as a sequence. */
export const featuredWork: ProjectPhoto[] = [0, 1, 8, 6, 7].map((i) => projectPhotos[i]);

export const cta = {
  title: "Elevate Your Logistics Experience.",
  text: "Where global expertise meets local execution.",
  button: "Contact Us Today",
};

/* ------------------------------------------------------------------------ */
/* Contact                                                                   */
/* ------------------------------------------------------------------------ */

export const cargoTypes = [
  "ODC / Over-dimensional cargo",
  "Break bulk",
  "Ro-Ro (vehicles & wheeled machinery)",
  "Dry bulk",
  "Project / EPC cargo",
  "Heavy lift",
  "Containerised (FCL / LCL)",
  "Air freight",
  "Dangerous goods",
  "Other",
];
