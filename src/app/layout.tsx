import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "DocuExpiry - Never miss a document expiration",
    template: "%s | DocuExpiry",
  },
  description:
    "Track passports, insurance, licences, and contracts. Get reminded before they expire. Free for up to 10 documents.",
  metadataBase: new URL("https://docuexpiry.com"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    siteName: "DocuExpiry",
    title: "DocuExpiry - Never miss a document expiration",
    description:
      "Track passports, insurance, licences, and contracts. Get reminded before they expire. Free for up to 10 documents.",
    url: "https://docuexpiry.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuExpiry - Never miss a document expiration",
    description:
      "Track passports, insurance, licences, and contracts. Get reminded before they expire.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
