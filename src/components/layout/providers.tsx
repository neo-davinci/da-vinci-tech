"use client";

import { ThemeProvider } from "next-themes";
import QueryProvider from "./query-provider";
import KBarWrapper from "@/components/kbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryProvider>
        <KBarWrapper>{children}</KBarWrapper>
      </QueryProvider>
    </ThemeProvider>
  );
}
