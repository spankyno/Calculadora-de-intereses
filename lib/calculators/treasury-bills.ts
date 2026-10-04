/**
 * Motor de cálculo de las Letras del Tesoro (módulo "Letras del Tesoro").
 * Son instrumentos de deuda a corto plazo emitidos al descuento: se
 * compran por debajo de su valor nominal y se reembolsan por el nominal
 * completo al vencimiento (no pagan cupón periódico).
 *
 * Precio de adquisición = Nominal / (1 + rentabilidad × días/360)
 * (convención ACT/360, la que usa el Tesoro Público en sus subastas)
 *
 * Como las letras se compran en unidades enteras de 1.000 € nominales,
 * el capital que el inversor quiere destinar casi nunca encaja de forma
 * exacta: lo que sobra es el "sobrante de la suscripción".
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
  /** Comisión del bróker/banco, en % sobre el capital invertido */
  commissionPercent: number;
  /** Tipo impositivo aplicable (IRPF, base del ahorro), en % */
  taxRate: number;
  /** Rentabilidad anual simple (TIR) ofrecida en cada plazo, en % */
  rates: Record<LetraTerm, number>;
}

export interface TreasuryBillResult {
  term: LetraTerm;
  days: number;
  /** Precio de adquisición de una letra (por 1.000 € de nominal) */
  price: number;
  /** Nº de letras enteras que se pueden comprar con el capital indicado */
  numLetras: number;
  /** Capital realmente invertido (numLetras × precio) */
  capitalInvested: number;
  /** Sobrante de la suscripción: lo que no llega a invertirse */
  leftover: number;
  /** Importe bruto a cobrar al vencimiento (numLetras × 1.000 €) */
  grossMaturityAmount: number;
  grossInterest: number;
  commissionAmount: number;
  taxWithheld: number;
  netInterest: number;
  /** Importe neto a cobrar al vencimiento, tras impuestos y comisión */
  netMaturityAmount: number;
  /** Rentabilidad neta total, sobre el capital invertido */
  netYieldPercent: number;
  /** Rentabilidad neta anualizada (base 360 días) */
  netYieldAnnualizedPercent: number;
}

export function calculateTreasuryBill(
  input: TreasuryBillsInput,
  term: LetraTerm
): TreasuryBillResult {
  const { capitalToInvest, commissionPercent, taxRate, rates } = input;
  const days = LETRA_TERM_DAYS[term];
  const annualRate = rates[term];

  const price = NOMINAL_PER_LETRA / (1 + (annualRate / 100) * (days / 360));
  const numLetras =
    price > 0 ? Math.floor(capitalToInvest / price) : 0;
  const capitalInvested = numLetras * price;
  const leftover = Math.max(capitalToInvest - capitalInvested, 0);

  const grossMaturityAmount = numLetras * NOMINAL_PER_LETRA;
  const grossInterest = grossMaturityAmount - capitalInvested;

  const commissionAmount = capitalInvested * (commissionPercent / 100);
  const taxWithheld = Math.max(grossInterest, 0) * (taxRate / 100);
  const netInterest = grossInterest - taxWithheld;
  const netMaturityAmount = capitalInvested + netInterest - commissionAmount;

  const netYieldPercent =
    capitalInvested > 0
      ? ((netMaturityAmount - capitalInvested) / capitalInvested) * 100
      : 0;
  const netYieldAnnualizedPercent = netYieldPercent * (360 / days);

  return {
    term,
    days,
    price,
    numLetras,
    capitalInvested,
    leftover,
    grossMaturityAmount,
    grossInterest,
    commissionAmount,
    taxWithheld,
    netInterest,
    netMaturityAmount,
    netYieldPercent,
    netYieldAnnualizedPercent,
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
    input.capitalToInvest >= NOMINAL_PER_LETRA &&
    typeof input.commissionPercent === "number" &&
    input.commissionPercent >= 0 &&
    typeof input.taxRate === "number" &&
    input.taxRate >= 0 &&
    input.taxRate <= 100
  );
}

export function createDefaultTreasuryBillsInput(): TreasuryBillsInput {
  return {
    capitalToInvest: 10000,
    commissionPercent: 0,
    taxRate: 19,
    rates: {
      "3m": 2.15,
      "6m": 2.25,
      "9m": 2.3,
      "12m": 2.35,
    },
  };
}

export { generateScenarioId };
