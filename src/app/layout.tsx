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
  title: "Carbon Compass — Track Your Carbon Footprint",
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
        <CarbonProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
        </CarbonProvider>
      </body>
    </html>
  );
}
