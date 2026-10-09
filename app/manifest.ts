import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Calc. Intereses",
    description:
      "Depósitos, interés compuesto, TAE, préstamos, hipotecas, amortización anticipada y Letras del Tesoro — gratis y al instante.",
    start_url: "/depositos",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#0a6b4a",
    lang: "es-ES",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
