import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Bo Bo Yan Zaw — Full-Stack Web Developer | PHP · Laravel · React";
const description =
  "Portfolio of Bo Bo Yan Zaw, a full-stack web developer from Pyinmana, Myanmar. 2+ years building production web apps with PHP, Laravel, React, JavaScript and MySQL — CRM, ERP, HRM systems, REST APIs and Linux server deployment.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: "%s | Bo Bo Yan Zaw",
  },
  description,
  keywords: [
    "Bo Bo Yan Zaw",
    "Full-Stack Web Developer",
    "Full Stack Developer Myanmar",
    "PHP Developer",
    "Laravel Developer",
    "React Developer",
    "JavaScript Developer",
    "MySQL",
    "RESTful API",
    "Linux Server Deployment",
    "Web Developer Pyinmana",
    "Web Developer Myanmar",
    "Freelance Web Developer",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: "Bo Bo Yan Zaw — Portfolio",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@BoBoYanZaw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#06060b",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: "Full-Stack Web Developer",
  description: SITE.tagline,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  telephone: "+959776764422",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pyinmana",
    addressCountry: "MM",
  },
  sameAs: SITE.socials.map((s) => s.url),
  knowsAbout: [
    "PHP",
    "Laravel",
    "React",
    "JavaScript (ES6+)",
    "MySQL",
    "RESTful API Development",
    "Linux Server Deployment",
    "Nginx",
    "Git & GitHub",
  ],
  alumniOf: { "@type": "EducationalOrganization", name: "Dagon University" },
  worksFor: {
    "@type": "Organization",
    name: "Linn IT Solutions Co., Ltd.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
