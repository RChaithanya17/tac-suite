export type GovernmentCertificate = {
  src: string;
  label: string;
  sub: string;
};

export const governmentCertificates: GovernmentCertificate[] = [
  {
    src: "/dpiit.png",
    label: "MSME Registered",
    sub: "Ministry of MSME, Govt. of India",
  },
  {
    src: "/001.png",
    label: "TAC Certified",
    sub: "Job & Freelance Ready",
  },
  {
    src: "/msme.png",
    label: "DPIIT Recognised",
    sub: "Startup India, Govt. of India",
  },
];