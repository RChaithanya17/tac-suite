/* Hiring partners shown in the "Our Hiring Partners" section (one grid).
 * Logos live in /public/hiring-partners. Category sets the colour bar on
 * top of each card and the legend under each grid. */

export type PartnerCategory =
  | "media"
  | "tech"
  | "brands"
  | "realEstate"
  | "education";

export type HiringPartner = {
  name: string;
  logo: string;
  category: PartnerCategory;
};

export type HiringPartnerSection = {
  eyebrow: string;
  /* Optional big heading under the eyebrow. */
  heading?: string;
  /* Show the colour legend under the grid. */
  showLegend: boolean;
  partners: HiringPartner[];
};

/* Legend order and colours (sampled from the design). */
export const partnerCategories: Record<
  PartnerCategory,
  { label: string; color: string }
> = {
  media: { label: "Media, creative and marketing", color: "#FF5A1F" },
  tech: { label: "AI and tech", color: "#2E6FDB" },
  brands: { label: "Brands", color: "#896949" },
  realEstate: { label: "Real estate", color: "#3A3A43" },
  education: { label: "Education and services", color: "#C8A325" },
};

const p = (
  name: string,
  slug: string,
  category: PartnerCategory
): HiringPartner => ({ name, logo: `/hiring-partners/${slug}.webp`, category });

export const hiringPartnerSections: HiringPartnerSection[] = [
  {
    eyebrow: "Associated Studios, Agencies & Hiring Partners",
    showLegend: false,
    partners: [
      // Top priority, in this exact order.
      p("Walls & Trends", "walls-and-trends", "media"),
      p("Student Tribe", "student-tribe", "media"),
      p("Hyderabad Talkies", "hyderabad-talkies", "media"),
      p("Reginald Men", "reginald-men", "brands"),
      p("Dakshin Stories", "dakshin-stories", "media"),
      p("Red Antz Studios", "red-antz-studios", "media"),
      p("Citta AI", "citta-ai", "tech"),
      p("The Big Day by Chai", "the-big-day-by-chai", "media"),
      p("KEUS", "keus", "tech"),
      p("Brochill", "brochill", "brands"),
      p("Karvi Solutions", "karvi-solutions", "education"),
      // Media, creative and marketing.
      p("B-HUB Media", "b-hub-media", "media"),
      p("Aloka Media", "aloka-media", "media"),
      p("YAAS Media", "yaas-media", "media"),
      p("RK Media", "rk-media", "media"),
      p("LUK Studio", "luk-studio", "media"),
      p("Camvya Photography", "camvya-photography", "media"),
      p("Obladi Creatives", "obladi-creatives", "media"),
      p("Yuvi Creations", "yuvi-creations", "media"),
      p("Digicarotene", "digicarotene", "media"),
      p("Starbuzz.ai", "starbuzz-ai", "tech"),
      // Tech, brands, real estate, education and more.
      p("Ozrit AI", "ozrit-ai", "tech"),
      p("Conduira", "conduira", "tech"),
      p("Medigita Technologies", "medigita-technologies", "tech"),
      p("CGS", "cgs", "tech"),
      p("OneGrasp", "onegrasp", "tech"),
      p("CloudFirst Computing", "cloudfirst-computing", "tech"),
      p("Peak St8 Club", "peak-st8-club", "tech"),
      p("Honasa Consumer", "honasa-consumer", "brands"),
      p("Raré Café", "rare-cafe", "brands"),
      p("Zyro Lifts", "zyro-lifts", "brands"),
      p("Hala Rentals", "hala-rentals", "brands"),
      p("Property Edge", "property-edge", "realEstate"),
      p("Sri Sreenivasa Infra", "sri-sreenivasa-infra", "realEstate"),
      p("Nikhila Constructions", "nikhila-constructions", "realEstate"),
      p("Swarna Sky", "swarna-sky", "realEstate"),
      p("Raksha IAS Academy", "raksha-ias-academy", "education"),
      p("Theory Consulting", "theory-consulting", "education"),
      p("Vayura Solutions", "vayura-solutions", "education"),
      p("Wilsson Procurement", "wilsson-procurement", "education"),
      p("EKAM", "ekam", "education"),
    ],
  },
];
