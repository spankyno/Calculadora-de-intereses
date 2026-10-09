import type { Metadata } from "next";
import { LetrasTesoroView } from "./letras-tesoro-view";

export const metadata: Metadata = {
  title: "Letras del Tesoro",
  description:
    "Calcula el precio de adquisición, el sobrante de la suscripción y el importe neto al vencimiento de las Letras del Tesoro, y compara la rentabilidad entre los plazos de 3, 6, 9 y 12 meses.",
  alternates: {
    canonical: "/letras-tesoro",
  },
  openGraph: {
    title: "Letras del Tesoro · Calculadora de Intereses",
    description:
      "Calcula el precio de adquisición, el sobrante de la suscripción y el importe neto al vencimiento de las Letras del Tesoro, y compara la rentabilidad entre los plazos de 3, 6, 9 y 12 meses.",
    url: "/letras-tesoro",
    images: [
      {
        url: "/og-image.png",
        width: 1424,
        height: 752,
        alt: "Letras del Tesoro · Calculadora de Intereses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Letras del Tesoro · Calculadora de Intereses",
    description:
      "Calcula el precio de adquisición, el sobrante de la suscripción y el importe neto al vencimiento de las Letras del Tesoro, y compara la rentabilidad entre los plazos de 3, 6, 9 y 12 meses.",
    images: ["/og-image.png"],
  },
};

export default function LetrasTesoroPage() {
  return <LetrasTesoroView />;
}
