import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL("https://calculadora-de-intereses.vercel.app"),
  title: {
    default: "Calculadora de Intereses — Simula tu ahorro con precisión",
    template: "%s · Calculadora de Intereses",
  },
  description:
    "Calcula el interés simple de tus depósitos e inversiones en segundos: TIN mensual, trimestral y semestral, retención fiscal (19% por defecto) e intereses netos. Compara varios escenarios lado a lado, gratis y sin registro.",
  keywords: [
    "calculadora de intereses",
    "interés simple",
    "TIN",
    "TAE",
    "depósitos bancarios",
    "retención fiscal",
    "rendimientos del capital mobiliario",
    "comparador de depósitos",
    "ahorro España",
  ],
  authors: [{ name: "Calculadora de Intereses" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Calculadora de Intereses — Simula tu ahorro con precisión",
    description:
      "Calcula intereses simples, retenciones fiscales y compara depósitos lado a lado. Gratis, instantáneo y sin registro.",
    siteName: "Calculadora de Intereses",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Intereses — Simula tu ahorro con precisión",
    description:
      "Calcula intereses simples, retenciones fiscales y compara depósitos lado a lado.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-noise relative min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="relative z-10">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
