/**
 * Motor de cálculo del Préstamo personal (módulo "Préstamo personal").
 * Sistema de amortización francés: cuota mensual constante, donde cada
 * pago se reparte en interés (decreciente) y capital (creciente).
 * Lógica pura, sin dependencias de React.
 */
import { generateScenarioId } from "./shared";
import {
  calculateMonthlyPayment,
  solveEffectiveMonthlyRate,
  buildAmortizationSchedule,
  type LoanAmortizationRow,
} from "./loan-math";

export type LoanDurationUnit = "meses" | "anios";

export const LOAN_DURATION_UNIT_LABELS: Record<LoanDurationUnit, string> = {
  meses: "meses",
  anios: "años",
};

export interface PersonalLoanInput {
  /** Capital del préstamo (importe financiado) en euros */
  principal: number;
  /** TIN anual nominal, en % */
  annualRate: number;
  /** Plazo, en la unidad indicada */
  duration: number;
  durationUnit: LoanDurationUnit;
  /** Comisión de apertura, en % sobre el capital financiado */
  openingFeePercent: number;
}

export type AmortizationRow = LoanAmortizationRow;

export interface PersonalLoanResult {
  totalMonths: number;
  monthlyRate: number;
  /** Cuota mensual constante */
  monthlyPayment: number;
  /** Suma de todas las cuotas pagadas */
  totalPaid: number;
  /** Total de intereses pagados durante toda la vida del préstamo */
  totalInterest: number;
  /** Importe de la comisión de apertura */
  openingFeeAmount: number;
  /** Lo que realmente recibes: capital menos comisión de apertura */
  netAmountReceived: number;
  /** TAE: tasa anual equivalente, ya con el efecto de la comisión de apertura */
  effectiveAnnualRate: number;
  schedule: AmortizationRow[];
}

function durationToMonths(duration: number, unit: LoanDurationUnit): number {
  return unit === "anios" ? duration * 12 : duration;
}

export function calculatePersonalLoan(
  input: PersonalLoanInput
): PersonalLoanResult {
  const { principal, annualRate, duration, durationUnit, openingFeePercent } =
    input;

  const totalMonths = Math.round(durationToMonths(duration, durationUnit));
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment = calculateMonthlyPayment(
    principal,
    monthlyRate,
    totalMonths
  );
  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - principal;

  const openingFeeAmount = principal * (openingFeePercent / 100);
  const netAmountReceived = principal - openingFeeAmount;

  const effectiveMonthlyRate = solveEffectiveMonthlyRate(
    monthlyPayment,
    netAmountReceived,
    totalMonths
  );
  const effectiveAnnualRate =
    (Math.pow(1 + effectiveMonthlyRate, 12) - 1) * 100;

  const schedule = buildAmortizationSchedule(
    principal,
    monthlyRate,
    monthlyPayment,
    totalMonths
  );

  return {
    totalMonths,
    monthlyRate,
    monthlyPayment,
    totalPaid,
    totalInterest,
    openingFeeAmount,
    netAmountReceived,
    effectiveAnnualRate,
    schedule,
  };
}

export function isValidPersonalLoanInput(
  input: Partial<PersonalLoanInput>
): boolean {
  return (
    typeof input.principal === "number" &&
    input.principal > 0 &&
    typeof input.annualRate === "number" &&
    input.annualRate >= 0 &&
    typeof input.duration === "number" &&
    input.duration > 0 &&
    typeof input.openingFeePercent === "number" &&
    input.openingFeePercent >= 0 &&
    input.openingFeePercent < 100
  );
}

export function createDefaultPersonalLoanInput(): PersonalLoanInput {
  return {
    principal: 12000,
    annualRate: 7.5,
    duration: 5,
    durationUnit: "anios",
    openingFeePercent: 1,
  };
}

export { generateScenarioId };
