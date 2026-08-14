"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { AppProvider } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
