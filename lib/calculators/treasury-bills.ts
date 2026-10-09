/**
 * Motor de cálculo de las Letras del Tesoro (módulo "Letras del Tesoro").
 * Son instrumentos de deuda a corto plazo emitidos al descuento: se
 * compran por debajo de su valor nominal y se reembolsan por el nominal
 * completo al vencimiento (no pagan cupón periódico).
 *
 * Precio de adquisición = Nominal / (1 + rentabilidad × días/360)
 * (convención ACT/360, la que usa el Tesoro Público en sus subastas)
 *
 * Mecánica de la suscripción (como en Tesoro Directo):
 *  - Se solicita un nº entero de letras de 1.000 € nominales.
 *  - "Capital invertido" = nº de letras × 1.000 € (lo que se reserva).
 *  - "Sobrante" = interés bruto: la diferencia entre el nominal y el precio
 *    real de adquisición, que el Tesoro devuelve tras la subasta.
 *  - "Coste real de adquisición" = Capital invertido − Sobrante.
 *
 * No se aplica retención en origen, por lo que no hay tipo impositivo.
 *
 * Lógica pura, sin dependencias de React.
 */
import { generateScenarioId } from "./shared";

export type LetraTerm = "3m" | "6m" | "9m" | "12m";

export const LETRA_TERMS: LetraTerm[] = ["3m", "6m", "9m", "12m"];

export const LETRA_TERM_LABELS: Record<LetraTerm, string> = {
  "3m": "3 meses",
  "6m": "6 meses",
  "9m": "9 meses",
  "12m": "12 meses",
};

/** Días aproximados hasta el vencimiento, según los plazos habituales del Tesoro Público */
export const LETRA_TERM_DAYS: Record<LetraTerm, number> = {
  "3m": 91,
  "6m": 182,
  "9m": 273,
  "12m": 364,
};

/** Valor nominal de cada letra individual */
export const NOMINAL_PER_LETRA = 1000;

export interface TreasuryBillsInput {
  /** Capital que el inversor quiere destinar a la compra */
  capitalToInvest: number;
  /** Rentabilidad anual simple (TIR) ofrecida en cada plazo, en % */
  rates: Record<LetraTerm, number>;
}

export interface TreasuryBillResult {
  term: LetraTerm;
  days: number;
  /** Precio de adquisición de una letra (por 1.000 € de nominal) */
  price: number;
  /** Nº de letras enteras: floor(capital / 1.000) */
  numLetras: number;
  /** Capital invertido = nº de letras × 1.000 € */
  capitalInvested: number;
  /** Sobrante (interés bruto) = Capital invertido − Coste real de adquisición */
  leftover: number;
  /** Coste real de adquisición = Capital invertido − Sobrante */
  realCost: number;
  /** Rentabilidad bruta del plazo: (Capital invertido − Coste) / Coste × 100 */
  grossYieldPercent: number;
  /** Rentabilidad bruta anualizada (base 360 días), para comparar plazos */
  grossYieldAnnualizedPercent: number;
}

export function calculateTreasuryBill(
  input: TreasuryBillsInput,
  term: LetraTerm
): TreasuryBillResult {
  const { capitalToInvest, rates } = input;
  const days = LETRA_TERM_DAYS[term];
  const annualRate = rates[term];

  const price = NOMINAL_PER_LETRA / (1 + (annualRate / 100) * (days / 360));
  const numLetras = Math.max(Math.floor(capitalToInvest / NOMINAL_PER_LETRA), 0);

  const capitalInvested = numLetras * NOMINAL_PER_LETRA;
  const realCost = numLetras * price;
  const leftover = capitalInvested - realCost;

  const grossYieldPercent =
    realCost > 0 ? ((capitalInvested - realCost) / realCost) * 100 : 0;
  const grossYieldAnnualizedPercent = grossYieldPercent * (360 / days);

  return {
    term,
    days,
    price,
    numLetras,
    capitalInvested,
    leftover,
    realCost,
    grossYieldPercent,
    grossYieldAnnualizedPercent,
  };
}

export function calculateAllTreasuryBills(
  input: TreasuryBillsInput
): TreasuryBillResult[] {
  return LETRA_TERMS.map((term) => calculateTreasuryBill(input, term));
}

export function isValidTreasuryBillsInput(
  input: Partial<TreasuryBillsInput>
): boolean {
  return (
    typeof input.capitalToInvest === "number" &&
    input.capitalToInvest >= NOMINAL_PER_LETRA
  );
}

export function createDefaultTreasuryBillsInput(): TreasuryBillsInput {
  return {
    capitalToInvest: 10000,
    rates: {
      "3m": 2.15,
      "6m": 2.25,
      "9m": 2.3,
      "12m": 2.35,
    },
  };
}

export { generateScenarioId };
