import type { Metadata } from "next";
import { PrestamoPersonalView } from "./prestamo-personal-view";

export const metadata: Metadata = {
  title: "Préstamo personal",
  description:
    "Calcula la cuota mensual de tu préstamo personal (sistema francés), el total de intereses, la TAE real y la tabla de amortización completa, mes a mes.",
};

export default function PrestamoPersonalPage() {
  return <PrestamoPersonalView />;
}
