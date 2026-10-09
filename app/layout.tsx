import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Coastal Herbalist | Coastal Dispensary & Botanical Remedies Margate",
  description:
    "Coastal Herbalist in Oslo Beach, Margate: premium botanical goods, herbal remedies, artisanal teas, topicals and curated cannabis products. Open daily 8:00 AM to 10:00 PM.",
  keywords: [
    "Coastal Herbalist",
    "Margate dispensary",
    "herbal remedies KZN",
    "CBD oil Margate",
    "botanical wellness South Coast",
    "Oslo Beach",
  ],
  openGraph: {
    title: "Coastal Herbalist | Coastal Dispensary & Botanical Remedies Margate",
    description:
      "Botanical goods, herbal remedies, teas, topicals and curated cannabis products on Marine Drive, Margate.",
    type: "website",
    locale: "en_ZA",
    siteName: "Coastal Herbalist",
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F291E",
  width: "device-width",
  initialScale: 1,
};

const tailwindConfig = `
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
`;

const globalStyles = `
html { scroll-behavior: smooth; background: #1A1E1C; }
body { -webkit-font-smoothing: antialiased; }
::selection { background: #D4A373; color: #0F291E; }
:focus-visible { outline: 2px solid #D4A373; outline-offset: 3px; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Coastal Herbalist",
  telephone: "+27826052137",
  address: {
    "@type": "PostalAddress",
    streetAddress: "99 Marine Dr, Oslo Beach",
    addressLocality: "Margate",
    addressRegion: "KwaZulu-Natal",
    postalCode: "4275",
    addressCountry: "ZA",
  },
  openingHours: "Mo-Su 08:00-22:00",
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body
        className="bg-[#1A1E1C] font-sans text-[#F8F9FA]"
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
