import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
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
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-deep text-text-primary font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
