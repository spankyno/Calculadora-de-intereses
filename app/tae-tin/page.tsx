import type { Metadata } from "next";
import { TaeTinView } from "./tae-tin-view";

export const metadata: Metadata = {
  title: "TAE / TIN — Conversor",
  description:
    "Convierte TIN nominal a TAE real y viceversa, según la frecuencia de liquidación. Compara cómo cambia la rentabilidad equivalente entre capitalización anual, semestral, trimestral, mensual y diaria.",
};

export default function TaeTinPage() {
  return <TaeTinView />;
}
