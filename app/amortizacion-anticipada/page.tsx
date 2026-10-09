import type { Metadata } from "next";
import { AmortizacionAnticipadaView } from "./amortizacion-anticipada-view";

export const metadata: Metadata = {
  title: "Amortización anticipada",
  description:
    "Compara reducir cuota vs. reducir plazo al hacer una aportación extra sobre tu préstamo o hipoteca, y descubre cuánto ahorras en intereses con cada estrategia.",
  alternates: {
    canonical: "/amortizacion-anticipada",
  },
  openGraph: {
    title: "Amortización anticipada · Calculadora de Intereses",
    description:
      "Compara reducir cuota vs. reducir plazo al hacer una aportación extra sobre tu préstamo o hipoteca, y descubre cuánto ahorras en intereses con cada estrategia.",
    url: "/amortizacion-anticipada",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Amortización anticipada · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amortización anticipada · Calculadora de Intereses",
    description:
      "Compara reducir cuota vs. reducir plazo al hacer una aportación extra sobre tu préstamo o hipoteca, y descubre cuánto ahorras en intereses con cada estrategia.",
    images: ["/og-image.png"],
  },
};

export default function AmortizacionAnticipadaPage() {
  return <AmortizacionAnticipadaView />;
}
