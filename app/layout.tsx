import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nourish",
  description: "Calorie tracking for everyday Egyptian meals.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-background text-foreground">
            {children}
            <BottomTabBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
