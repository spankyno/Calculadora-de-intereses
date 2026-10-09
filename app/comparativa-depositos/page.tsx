import type { Metadata } from "next";
import { ComparativaDepositosView } from "./comparativa-depositos-view";

export const metadata: Metadata = {
  title: "Comparativa de depósitos",
  description:
    "Compara varios productos de depósito con distinto plazo, TIN, comisiones, retención y capitalización (simple o compuesta), y descubre cuál te deja realmente más dinero.",
  alternates: {
    canonical: "/comparativa-depositos",
  },
  openGraph: {
    title: "Comparativa de depósitos · Calculadora de Intereses",
    description:
      "Compara varios productos de depósito con distinto plazo, TIN, comisiones, retención y capitalización (simple o compuesta), y descubre cuál te deja realmente más dinero.",
    url: "/comparativa-depositos",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Comparativa de depósitos · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparativa de depósitos · Calculadora de Intereses",
    description:
      "Compara varios productos de depósito con distinto plazo, TIN, comisiones, retención y capitalización (simple o compuesta), y descubre cuál te deja realmente más dinero.",
    images: ["/og-image.png"],
  },
};

export default function ComparativaDepositosPage() {
  return <ComparativaDepositosView />;
}
