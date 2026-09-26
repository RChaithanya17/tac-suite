export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = FooterLink;

export type FooterContact = {
  addressLines: [string, string, string, string];
  phone: string;
  phoneHref: string;
  admissionsEmail: string;
  admissionsEmailHref: string;
};

export type FooterBadge = {
  label: string;
};

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/tac_theartcode?igsh=dTk2NGpvb2ZoZmVx" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tac-the-art-code/" },
  { label: "YouTube", href: "https://www.youtube.com/@the_artcode" },
];

export const footerContact: FooterContact = {
  addressLines: [
    "4th Floor,",
    "Plot No. 286, Road No 16,",
    "Ayyappa Society Main Rd",
    "Madhapur, Telangana 500081",
  ],
  phone: "+91 9966 430 431",
  phoneHref: "tel:+919966430431",
  admissionsEmail: "admissions@theartcode.org",
  admissionsEmailHref: "mailto:admissions@theartcode.org",
};

export const courseAboutLinks: FooterLink[] = [
  { label: "Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
];

export const legalLinks: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Payment Terms", href: "/payment-terms" },
];

export const footerBadges: FooterBadge[] = [
  { label: "DPIIT Recognised" },
  { label: "NSDC Affiliated" },
  { label: "Skill India Certified" },
];

export const footerCopy = {
  copyright: "© 2025 TAC School of Modern Learning Pvt. Ltd.",
  marketingStatement: "Building creators into professionals — portfolio, job & freelance ready.",
};
