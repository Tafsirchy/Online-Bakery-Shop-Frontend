import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online Bakery Shop | Classic & Cozy",
  description: "Freshly baked bread, pastries, and cakes delivered to your door.",
};

import AppChrome from "@/components/shared/AppChrome";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
