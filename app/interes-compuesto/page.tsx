import type { Metadata } from "next";
import { InteresCompuestoView } from "./interes-compuesto-view";

export const metadata: Metadata = {
  title: "Interés compuesto",
  description:
    "Calcula el interés compuesto de tus inversiones: TAE real, frecuencia de capitalización, retención fiscal e intereses netos. Compara varios escenarios lado a lado.",
  alternates: {
    canonical: "/interes-compuesto",
  },
  openGraph: {
    title: "Interés compuesto · Calculadora de Intereses",
    description:
      "Calcula el interés compuesto de tus inversiones: TAE real, frecuencia de capitalización, retención fiscal e intereses netos. Compara varios escenarios lado a lado.",
    url: "/interes-compuesto",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Interés compuesto · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interés compuesto · Calculadora de Intereses",
    description:
      "Calcula el interés compuesto de tus inversiones: TAE real, frecuencia de capitalización, retención fiscal e intereses netos. Compara varios escenarios lado a lado.",
    images: ["/og-image.png"],
  },
};

export default function InteresCompuestoPage() {
  return <InteresCompuestoView />;
}
