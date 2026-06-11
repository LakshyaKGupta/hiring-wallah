import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import MeshBackground from "@/components/ui/MeshBackground";
import { CursorEffect } from "@/components/ui/CursorEffect";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hiring Agent OS — Your AI Hiring Committee",
  description: "An autonomous multi-agent hiring intelligence platform that converts job requirements into evidence-backed hiring decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${bricolageGrotesque.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-deep text-text-primary font-sans relative">
        <CursorEffect />
        <MeshBackground fixed mode="full" opacity={0.22} className="z-0" />
        <div className="relative z-10 flex flex-col flex-1 min-h-full">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
