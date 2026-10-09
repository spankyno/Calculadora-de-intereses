import type { Metadata } from "next";
import { DepositosView } from "./depositos-view";

export const metadata: Metadata = {
  title: "Depósitos — Interés simple",
  description:
    "Calcula el interés simple de tus depósitos: TIN mensual, trimestral y semestral, retención fiscal e intereses netos. Compara varios depósitos lado a lado.",
  alternates: {
    canonical: "/depositos",
  },
  openGraph: {
    title: "Depósitos — Interés simple · Calculadora de Intereses",
    description:
      "Calcula el interés simple de tus depósitos: TIN mensual, trimestral y semestral, retención fiscal e intereses netos. Compara varios depósitos lado a lado.",
    url: "/depositos",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Depósitos — Interés simple · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Depósitos — Interés simple · Calculadora de Intereses",
    description:
      "Calcula el interés simple de tus depósitos: TIN mensual, trimestral y semestral, retención fiscal e intereses netos. Compara varios depósitos lado a lado.",
    images: ["/og-image.png"],
  },
};

export default function DepositosPage() {
  return <DepositosView />;
}
