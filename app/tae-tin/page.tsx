import type { Metadata } from "next";
import { TaeTinView } from "./tae-tin-view";

export const metadata: Metadata = {
  title: "TAE / TIN — Conversor",
  description:
    "Convierte TIN nominal a TAE real y viceversa, según la frecuencia de liquidación. Compara cómo cambia la rentabilidad equivalente entre capitalización anual, semestral, trimestral, mensual y diaria.",
  alternates: {
    canonical: "/tae-tin",
  },
  openGraph: {
    title: "TAE / TIN — Conversor · Calculadora de Intereses",
    description:
      "Convierte TIN nominal a TAE real y viceversa, según la frecuencia de liquidación. Compara cómo cambia la rentabilidad equivalente entre capitalización anual, semestral, trimestral, mensual y diaria.",
    url: "/tae-tin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TAE / TIN — Conversor · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAE / TIN — Conversor · Calculadora de Intereses",
    description:
      "Convierte TIN nominal a TAE real y viceversa, según la frecuencia de liquidación. Compara cómo cambia la rentabilidad equivalente entre capitalización anual, semestral, trimestral, mensual y diaria.",
    images: ["/og-image.png"],
  },
};

export default function TaeTinPage() {
  return <TaeTinView />;
}
