import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Bricolage_Grotesque, Fraunces, Space_Grotesk, Rubik } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ChatWidget } from "@/components/ChatWidget";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";

const geistSans = Geist({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono-tech",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display-grotesque",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-italic-serif",
  style: ["normal", "italic"],
  weight: "400",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-accent-serif",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

// Space Grotesk — distinctive, modern grotesk with character. Used by
// Linear, Hugging Face and other design-forward tech brands. Cool but
// still formal enough for site-wide headings.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-discovery-tech",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Rubik — primary site font. Closest free substitute for Fontshok's
// Discovery: heavy, slightly geometric Hebrew sans with full Latin
// coverage. Full weight range so headlines can hit the chunky black
// look while body copy stays at a normal weight.
const rubik = Rubik({
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "Clix — בינה מהונדסת לעסק שלכם.",
  description:
    "Clix בונה סוכני AI, אוטומציות WhatsApp, מערכות CRM ותוכנה ייעודית לארגונים שמוכנים לפעול במהירות של הבינה המלאכותית.",
  metadataBase: new URL("https://clix-solution.com"),
  icons: {
    icon: "/clix-logo.png",
    shortcut: "/clix-logo.png",
    apple: "/clix-logo.png",
  },
  openGraph: {
    title: "Clix — בינה מהונדסת לעסק שלכם.",
    description:
      "סוכני AI, אוטומציות WhatsApp, מערכות CRM ותוכנה ייעודית לעסקים מודרניים.",
    images: ["/clix-logo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${instrumentSerif.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:btn-violet focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1 relative z-[2] page-enter">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <ChatWidget />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
