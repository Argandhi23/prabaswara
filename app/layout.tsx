import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Prabaswara | Photography & Creative Visual Studio",
    template: "%s | Prabaswara",
  },
  description:
    "Prabaswara adalah studio fotografi profesional yang menaungi Swara Gallery, Swara Studio, Swara Moment, dan Swara Wedding. Menyajikan keindahan visual, dokumentasi momen berharga, dan portofolio artistik terbaik.",
  keywords: [
    "Prabaswara",
    "Fotografi Profesional",
    "Swara Gallery",
    "Swara Studio",
    "Swara Moment",
    "Swara Wedding",
    "Foto Wedding",
    "Foto Studio",
    "Dokumentasi Acara",
    "Portofolio Fotografi",
  ],
  authors: [{ name: "Prabaswara Studio" }],
  creator: "Prabaswara",
  publisher: "Prabaswara",
  metadataBase: new URL("https://prabaswara.vercel.app"),
  openGraph: {
    title: "Prabaswara | Photography & Creative Visual Studio",
    description:
      "Studio fotografi profesional: Swara Gallery, Swara Studio, Swara Moment, & Swara Wedding.",
    url: "https://prabaswara.vercel.app",
    siteName: "Prabaswara Photography",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prabaswara Photography",
    description: "Photography & Creative Visual Studio",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="bg-[#FFFFFF] text-[#171717] min-h-screen flex flex-col font-sans-body selection:bg-[#171717] selection:text-[#FFFFFF]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
