import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { CarbonProvider } from "@/context/CarbonContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonIQ — Track & Reduce Your Carbon Footprint",
  description:
    "Measure your environmental impact, discover what's driving emissions, and receive personalized actions to reduce your carbon footprint every day.",
  keywords: ["carbon footprint", "sustainability", "environment", "emissions tracker", "climate action"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        {/* Skip to main content link for keyboard / screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-primary focus:text-bg-primary focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <CarbonProvider>
          <Navigation />
          <main id="main-content" role="main" className="flex-1">{children}</main>
        </CarbonProvider>
      </body>
    </html>
  );
}
