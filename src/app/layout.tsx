import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sidra Catalán - Tradición desde 1850",
  description:
    "Sidra & Chicha elaboradas con manzanas ancestrales de Los Ríos. Elegancia, exclusividad, calidad y tradición desde 1850.",
  keywords:
    "sidra, chicha, Los Ríos, Chile, tradición, artesanal, manzanas ancestrales",
  authors: [{ name: "Sidra Catalán" }],
  openGraph: {
    title: "Sidra Catalán - Tradición desde 1850",
    description:
      "Sidra & Chicha elaboradas con manzanas ancestrales de Los Ríos",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
