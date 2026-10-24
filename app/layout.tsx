import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Sora } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { PageTransition } from "@/components/PageTransition";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { images, nav, site } from "@/lib/data";
import { getLogo } from "@/lib/logo";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-barlow-condensed",
  display: "swap",
  // Only used for numerals; don't compete with the hero's fonts and image on first load.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [{ url: images.ctaBanner.src, width: images.ctaBanner.width, height: images.ctaBanner.height, alt: images.ctaBanner.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a1a2f",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: images.hero.src,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.lines.slice(0, 2).join(", "),
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
};

/*
 * Runs before first paint:
 *  - html.js lets CSS hide elements that animate in on load (no flash of final state).
 *  - data-intro decides the preloader: first desktop visit per session, never with reduced motion.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var on=false;try{on=!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(min-width: 1024px)').matches&&!sessionStorage.getItem('jnros-intro');if(on)sessionStorage.setItem('jnros-intro','1')}catch(e){}d.setAttribute('data-intro',on?'on':'off')})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const logo = getLogo();

  return (
    <html
      lang="en-IN"
      className={`${sora.variable} ${inter.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Without JavaScript, show everything that would otherwise animate in. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>[style*="opacity:0"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}</style>',
          }}
        />
      </head>
      <body className="bg-offwhite font-sans text-navy antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll>
            <PageTransition>
              <Preloader />
              <Cursor />
              <Header logo={logo} nav={nav} />
              <main id="main">{children}</main>
              <Footer logo={logo} />
              <WhatsAppButton />
            </PageTransition>
          </SmoothScroll>
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
