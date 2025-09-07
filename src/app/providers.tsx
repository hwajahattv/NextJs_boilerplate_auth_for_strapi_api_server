"use client";

import { SnackbarProvider } from "@/components/Common/SnackbarProvider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}
