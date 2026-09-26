import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theartcode.org"),
  alternates: {
    canonical: "/",
  },
  title: "TAC Suite | 8 Creative Skills in One Course",
  description:
    "Learn 8 creative skills in one course at TAC Suite, Hyderabad. Master video editing, graphic design, digital marketing, content creation and more.",
  keywords: [
    "creative courses in Hyderabad",
    "video editing course Hyderabad",
    "graphic design course Hyderabad",
    "digital marketing course Madhapur",
    "content creation course Hyderabad",
    "After Effects course Hyderabad",
    "DaVinci Resolve training Hyderabad",
    "Premiere Pro course Hyderabad",
    "Photoshop Illustrator course Hyderabad",
    "freelance content creator course India",
    "TAC Suite",
    "The Art Code Hyderabad",
    "8 skills one course",
    "10 industry portfolio certificate",
    "job ready creative course India",
    "NSDC certified creative course",
    "Skill India creative program Hyderabad",
    "best creative course after 12th Hyderabad",
    "video editing and graphic design course together",
    "creative course with placement assistance Hyderabad",
    "short term creative course Madhapur Hyderabad",
    "content creator course with certificate India",
    "Video Editing & Graphic Design Course in Hyderabad",
    "Learn 8 Creative Skills & Get Placed",
    "Best Creative Course in Madhapur Hyderabad",
    "creative course Madhapur",
    "video editing institute Madhapur Hyderabad",
    "graphic design institute HITEC City",
    "design school Jubilee Hills Hyderabad",
    "best creative institute Gachibowli",
    "content creator course Banjara Hills",
    "After Effects course Hyderabad",
    "DaVinci Resolve color grading course",
    "motion graphics course Hyderabad",
    "reels editing course Hyderabad",
    "brand design course Hyderabad",
    "content shooting course Hyderabad",
    "freelance digital marketing course India",
    "creative course with placement Hyderabad",
    "earn from content creation course India",
    "freelance graphic design course Hyderabad",
    "video editor job course Hyderabad",
    "content creator career course India",
    "creative skills for job Hyderabad",
    "portfolio building course Hyderabad",
    "8 in 1 creative course India",
    "video editing and graphic design course together Hyderabad",
    "best creative course after graduation Hyderabad",
    "short term creative course with certificate Hyderabad",
    "creative course for freshers Hyderabad",
    "learn video editing and marketing together",
    "design and digital marketing course in one",
    "content creator full course offline Hyderabad",
  ],
  openGraph: {
    title: "TAC Suite | 8 Creative Skills in One Course",
    description:
      "Learn 8 creative skills in one course at TAC Suite, Hyderabad. Master video editing, graphic design, digital marketing, content creation and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TAC Suite | 8 Creative Skills in One Course",
    description:
      "Learn 8 creative skills in one course at TAC Suite, Hyderabad. Master video editing, graphic design, digital marketing, content creation and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
  {/* Schema.org structured data */}
  <Script
    id="schema-org"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://theartcode.org/#organization",
            name: "The Art Code",
            url: "https://theartcode.org",
          },
          {
            "@type": "WebSite",
            "@id": "https://theartcode.org/#website",
            name: "TAC Suite",
            url: "https://theartcode.org",
            publisher: {
              "@id": "https://theartcode.org/#organization",
            },
          },
        ],
      }),
    }}
  />

        {/* 🔥 Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '997174922492298');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* 🔥 Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TFNDZJSP');
            `,
          }}
        />
      </head>

      <body
        className="min-h-full flex flex-col bg-[#FBF8E4] text-black"
        suppressHydrationWarning
      >
        {/* 🔥 GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFNDZJSP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* 🔥 Facebook Pixel NoScript */}
        <noscript>
          {/* This is an intentional Facebook tracking pixel; it must remain a plain <img>. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=997174922492298&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col gap-0">{children}</main>
      </body>
    </html>
  );
}