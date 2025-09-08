// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import FluidEffect from "./components/FluidEffect"; // Import the new component

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const imperial = localFont({
  src: "../public/fonts/imperial-black.ttf",
  variable: "--font-imperial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MATTHEW SUSKO",
  description: "Welcome to my portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${inter.variable} ${imperial.variable}`}>
        <FluidEffect />
        <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
      </body>
    </html>
  );
}
