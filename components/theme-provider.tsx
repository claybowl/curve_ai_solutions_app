"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use suppressHydrationWarning to prevent hydration mismatch warnings
  return (
    <NextThemesProvider {...props} enableSystem={true} enableColorScheme={true} defaultTheme="system">
      <style jsx global suppressHydrationWarning>{`
        :root {
          --font-sans: __variable_3a0388;
          --font-mono: __variable_c1e5c9;
        }
      `}</style>
      {children}
    </NextThemesProvider>
  )
}
