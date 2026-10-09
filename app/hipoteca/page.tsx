import type { Metadata } from "next";
import { HipotecaView } from "./hipoteca-view";

export const metadata: Metadata = {
  title: "Hipoteca",
  description:
    "Calcula la cuota de tu hipoteca (sistema francés) a tipo fijo o variable, la TAE real, el cuadro de amortización completo y simula el ahorro de una amortización anticipada.",
  alternates: {
    canonical: "/hipoteca",
  },
  openGraph: {
    title: "Hipoteca · Calculadora de Intereses",
    description:
      "Calcula la cuota de tu hipoteca (sistema francés) a tipo fijo o variable, la TAE real, el cuadro de amortización completo y simula el ahorro de una amortización anticipada.",
    url: "/hipoteca",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Hipoteca · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hipoteca · Calculadora de Intereses",
    description:
      "Calcula la cuota de tu hipoteca (sistema francés) a tipo fijo o variable, la TAE real, el cuadro de amortización completo y simula el ahorro de una amortización anticipada.",
    images: ["/og-image.png"],
  },
};

export default function HipotecaPage() {
  return <HipotecaView />;
}
