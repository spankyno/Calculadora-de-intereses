import type { Metadata } from "next";
import { InteresCompuestoView } from "./interes-compuesto-view";

export const metadata: Metadata = {
  title: "Interés compuesto",
  description:
    "Calcula el interés compuesto de tus inversiones: TAE real, frecuencia de capitalización, retención fiscal e intereses netos. Compara varios escenarios lado a lado.",
};

export default function InteresCompuestoPage() {
  return <InteresCompuestoView />;
}
