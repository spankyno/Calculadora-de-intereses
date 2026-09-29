import type { Metadata } from "next";
import { ComparativaDepositosView } from "./comparativa-depositos-view";

export const metadata: Metadata = {
  title: "Comparativa de depósitos",
  description:
    "Compara varios productos de depósito con distinto plazo, TIN, comisiones, retención y capitalización (simple o compuesta), y descubre cuál te deja realmente más dinero.",
};

export default function ComparativaDepositosPage() {
  return <ComparativaDepositosView />;
}
