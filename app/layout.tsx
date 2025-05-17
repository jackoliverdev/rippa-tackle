import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { MyFirebaseProvider } from "@/components/firebase-providers";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

const font = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rippa Tackle | Carp Specialists",
  description:
    "Rippa Tackle offers premium quality carp fishing tackle, bait and equipment for UK anglers. Discover our range of specialist products for your perfect session on the bank.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="icon" href="/rippa_logo.png" type="image/png" />
      </head>
      <body className={cn(font.className, "overflow-x-hidden w-screen")}>
        <MyFirebaseProvider>
          {children}
          <Toaster />
        </MyFirebaseProvider>
      </body>
    </html>
  );
}
