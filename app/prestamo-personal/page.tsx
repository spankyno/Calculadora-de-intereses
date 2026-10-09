import type { Metadata } from "next";
import { PrestamoPersonalView } from "./prestamo-personal-view";

export const metadata: Metadata = {
  title: "Préstamo personal",
  description:
    "Calcula la cuota mensual de tu préstamo personal (sistema francés), el total de intereses, la TAE real y la tabla de amortización completa, mes a mes.",
  alternates: {
    canonical: "/prestamo-personal",
  },
  openGraph: {
    title: "Préstamo personal · Calculadora de Intereses",
    description:
      "Calcula la cuota mensual de tu préstamo personal (sistema francés), el total de intereses, la TAE real y la tabla de amortización completa, mes a mes.",
    url: "/prestamo-personal",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Préstamo personal · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Préstamo personal · Calculadora de Intereses",
    description:
      "Calcula la cuota mensual de tu préstamo personal (sistema francés), el total de intereses, la TAE real y la tabla de amortización completa, mes a mes.",
    images: ["/og-image.png"],
  },
};

export default function PrestamoPersonalPage() {
  return <PrestamoPersonalView />;
}
