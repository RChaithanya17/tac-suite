export type HeroStripItem = {
  label: string;
  color: string;
  icon: string;
};

export type HeroStat = {
  val: string;
  label: string;
};

export const topStripItems: HeroStripItem[] = [
  { label: "Brand Identity", color: "#FFC62A", icon: "◈" },
  { label: "Logo Design", color: "#E8D5A0", icon: "⬡" },
  { label: "Social Kit", color: "#FFC62A", icon: "▣" },
  { label: "Poster Art", color: "#D4B87A", icon: "◉" },
  { label: "Motion Reel", color: "#FFC62A", icon: "▷" },
  { label: "Color Grade", color: "#E8D5A0", icon: "◑" },
  { label: "Brand Book", color: "#FFC62A", icon: "◈" },
  { label: "Thumbnail Set", color: "#D4B87A", icon: "▦" },
  { label: "Merch Design", color: "#FFC62A", icon: "⬡" },
  { label: "IG Template", color: "#E8D5A0", icon: "◉" },
];

export const bottomStripItems: HeroStripItem[] = [
  { label: "Product Shoot", color: "#FFC62A", icon: "◎" },
  { label: "Reel Edit", color: "#E8D5A0", icon: "▷" },
  { label: "Ad Campaign", color: "#FFC62A", icon: "◈" },
  { label: "Brand Film", color: "#D4B87A", icon: "◉" },
  { label: "Typography Kit", color: "#FFC62A", icon: "▣" },
  { label: "Event Coverage", color: "#E8D5A0", icon: "◑" },
  { label: "Pitch Deck", color: "#FFC62A", icon: "▦" },
  { label: "Photo Edit", color: "#D4B87A", icon: "⬡" },
  { label: "YT Thumbnail", color: "#FFC62A", icon: "◈" },
  { label: "Brand Mockup", color: "#E8D5A0", icon: "◉" },
];

export const heroStats: HeroStat[] = [
  { val: "5", label: "Cohorts Done" },
  { val: "₹30K", label: "Avg Package" },
  { val: "10", label: "Portfolio" },
  { val: "8", label: "Skills" },
];
