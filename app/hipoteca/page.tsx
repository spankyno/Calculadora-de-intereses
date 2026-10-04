import type { Metadata } from "next";
import { HipotecaView } from "./hipoteca-view";

export const metadata: Metadata = {
  title: "Hipoteca",
  description:
    "Calcula la cuota de tu hipoteca (sistema francés) a tipo fijo o variable, la TAE real, el cuadro de amortización completo y simula el ahorro de una amortización anticipada.",
};

export default function HipotecaPage() {
  return <HipotecaView />;
}
