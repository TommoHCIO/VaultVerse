import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "VaultorVerse - Premium Prediction Markets",
  description: "Experience the future of prediction markets with advanced trading tools and Shield protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-slate-900 text-white`}>
        {children}
      </body>
    </html>
  );
}