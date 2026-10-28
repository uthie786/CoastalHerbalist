import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const description =
  "Rooftop 420: members' lounges, bud shops and rooftop spaces across Greater Durban and Greater Cape Town. Find your nearest store in Berea, Overport, Windermere, Pinetown, Isipingo Beach, Sea Point, Plumstead, Newlands, Claremont, Hout Bay and Wynberg.";

export const metadata: Metadata = {
  title: "Rooftop 420 | Cannabis Lounges & Bud Shops in Durban and Cape Town",
  description,
  keywords: [
    "Rooftop 420",
    "Studio 420",
    "Durban cannabis lounge",
    "Cape Town cannabis lounge",
    "bud shop Durban",
    "bud shop Cape Town",
    "cannabis club South Africa",
  ],
  openGraph: {
    title: "Rooftop 420 | Cannabis Lounges & Bud Shops",
    description,
    type: "website",
    locale: "en_ZA",
    siteName: "Rooftop 420",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0A",
  width: "device-width",
  initialScale: 1,
};

const tailwindConfig = `
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
`;

const globalStyles = `
html { scroll-behavior: smooth; background: #121412; }
body { -webkit-font-smoothing: antialiased; }
::selection { background: #F4C430; color: #0A0B0A; }
:focus-visible { outline: 2px solid #F4C430; outline-offset: 3px; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

const stores: [string, string, string][] = [
  ["Berea", "147 Problem Mkhize Road, Essenwood, Berea", "Durban"],
  ["Overport", "Shop 7, Sunway Centre, 65 Overport Drive, Overport", "Durban"],
  ["Windermere", "196 Gordon Road, Windermere", "Durban"],
  ["Pinetown", "48 Bartlett Road, Farningham Ridge", "Pinetown"],
  ["Isipingo Beach", "3 Beach Road, Isipingo Beach", "Durban"],
  ["Sea Point", "233 Main Road, Sea Point", "Cape Town"],
  ["Plumstead", "126 Main Road, Plumstead", "Cape Town"],
  ["Newlands", "18 Wilkinson Street, Newlands", "Cape Town"],
  ["Claremont", "18 Imam Haron Road, Claremont", "Cape Town"],
  ["Hout Bay", "Victoria Mall, 17A Victoria Road, Hout Bay", "Cape Town"],
  ["Wynberg", "Wynberg Centre, 123 Main Road, Wynberg", "Cape Town"],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rooftop 420",
  logo: "/rooftop420-logo.png",
  location: stores.map(([name, streetAddress, addressLocality]) => ({
    "@type": "Store",
    name: `Rooftop 420 ${name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion: addressLocality === "Cape Town" ? "Western Cape" : "KwaZulu-Natal",
      addressCountry: "ZA",
    },
  })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body
        className="bg-[#121412] font-sans text-[#F7F5EF]"
        style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
