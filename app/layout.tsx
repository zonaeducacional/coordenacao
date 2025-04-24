import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioFallback } from "@/components/audio-fallback"

export const metadata: Metadata = {
  title: "Aventura no Crescente Fértil",
  description: "Um RPG educativo sobre as primeiras civilizações da humanidade",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AudioFallback />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
