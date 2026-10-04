import type { Metadata } from "next";
import { LetrasTesoroView } from "./letras-tesoro-view";

export const metadata: Metadata = {
  title: "Letras del Tesoro",
  description:
    "Calcula el precio de adquisición, el sobrante de la suscripción y el importe neto al vencimiento de las Letras del Tesoro, y compara la rentabilidad entre los plazos de 3, 6, 9 y 12 meses.",
};

export default function LetrasTesoroPage() {
  return <LetrasTesoroView />;
}
