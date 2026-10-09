import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site-config";

const DEFAULT_TITLE = "Calculadora de Intereses — Simula tu ahorro con precisión";
const DEFAULT_DESCRIPTION =
  "Calcula el interés simple de tus depósitos e inversiones en segundos: TIN mensual, trimestral y semestral, retención fiscal (19% por defecto) e intereses netos. Compara varios escenarios lado a lado, gratis y sin registro.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "calculadora de intereses",
    "interés simple",
    "interés compuesto",
    "TIN",
    "TAE",
    "depósitos bancarios",
    "retención fiscal",
    "rendimientos del capital mobiliario",
    "comparador de depósitos",
    "préstamo personal",
    "hipoteca",
    "amortización anticipada",
    "letras del Tesoro",
    "ahorro España",
  ],
  authors: [{ name: AUTHOR.name, url: AUTHOR.blogUrl }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description:
      "Calcula intereses simples, retenciones fiscales y compara depósitos lado a lado. Gratis, instantáneo y sin registro.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description:
      "Calcula intereses simples, retenciones fiscales y compara depósitos lado a lado.",
    images: ["/og-image.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "es-ES",
      author: { "@id": `${SITE_URL}/#author` },
      publisher: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: AUTHOR.name,
      url: AUTHOR.blogUrl,
      sameAs: [AUTHOR.blogUrl, AUTHOR.hubUrl, AUTHOR.contactUrl],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
