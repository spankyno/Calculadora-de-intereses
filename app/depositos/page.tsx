import type { Metadata } from "next";
import { DepositosView } from "./depositos-view";

export const metadata: Metadata = {
  title: "Depósitos — Interés simple",
  description:
    "Calcula el interés simple de tus depósitos: TIN mensual, trimestral y semestral, retención fiscal e intereses netos. Compara varios depósitos lado a lado.",
};

export default function DepositosPage() {
  return <DepositosView />;
}
