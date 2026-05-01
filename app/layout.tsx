import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ViewProvider } from "@/components/ViewContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arziqa | Commodity Infrastructure for Nigeria",
  description:
    "Arziqa builds commodity storage, processing, and export infrastructure to reduce post-harvest losses and connect Nigerian farmers to global markets.",
  keywords: [
    "Nigeria",
    "commodity",
    "storage",
    "warehouse",
    "agriculture",
    "export",
    "post-harvest",
    "infrastructure",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-text-primary">
        <ViewProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ViewProvider>
      </body>
    </html>
  );
}
