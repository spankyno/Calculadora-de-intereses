import type { Metadata } from "next";
import { AmortizacionAnticipadaView } from "./amortizacion-anticipada-view";

export const metadata: Metadata = {
  title: "Amortización anticipada",
  description:
    "Compara reducir cuota vs. reducir plazo al hacer una aportación extra sobre tu préstamo o hipoteca, y descubre cuánto ahorras en intereses con cada estrategia.",
};

export default function AmortizacionAnticipadaPage() {
  return <AmortizacionAnticipadaView />;
}
