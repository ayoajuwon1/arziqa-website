import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Arziqa \u2014 Journey of a Grain",
  description:
    "Follow a single sesame seed from a Nigerian farmer\u2019s hand to a buyer in Osaka. Arziqa builds commodity storage, processing, and export infrastructure across Nigeria.",
  keywords: [
    "Nigeria",
    "commodity",
    "storage",
    "warehouse",
    "agriculture",
    "export",
    "post-harvest",
    "infrastructure",
    "sesame",
    "Arziqa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
