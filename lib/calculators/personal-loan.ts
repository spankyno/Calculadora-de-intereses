/**
 * Motor de cálculo del Préstamo personal (módulo "Préstamo personal").
 * Sistema de amortización francés: cuota mensual constante, donde cada
 * pago se reparte en interés (decreciente) y capital (creciente).
 * Lógica pura, sin dependencias de React.
 */
import { generateScenarioId } from "./shared";

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

export interface AmortizationRow {
  month: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}

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

const MAX_SCHEDULE_MONTHS = 600; // 50 años, límite de seguridad

function durationToMonths(duration: number, unit: LoanDurationUnit): number {
  return unit === "anios" ? duration * 12 : duration;
}

/**
 * Calcula la cuota mensual constante del sistema francés.
 * M = P × r × (1+r)^n / [(1+r)^n − 1], con caso especial para r = 0.
 */
function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  totalMonths: number
): number {
  if (totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Resuelve por bisección el tipo mensual efectivo `i` tal que el valor
 * actual de las cuotas, descontado a `i`, iguale el importe neto recibido.
 * Con esto se obtiene la TAE real (incluye el efecto de la comisión).
 */
function solveEffectiveMonthlyRate(
  payment: number,
  netAmount: number,
  totalMonths: number
): number {
  if (totalMonths <= 0 || payment <= 0 || netAmount <= 0) return 0;

  const presentValue = (i: number) => {
    if (Math.abs(i) < 1e-9) return payment * totalMonths;
    return (payment * (1 - Math.pow(1 + i, -totalMonths))) / i;
  };

  let low = 0;
  let high = 5; // 500% mensual, límite muy generoso

  // Si ni siquiera con un tipo altísimo el valor actual baja lo suficiente,
  // devolvemos el límite superior en vez de iterar sobre un caso degenerado.
  if (presentValue(high) > netAmount) return high;

  for (let iter = 0; iter < 100; iter++) {
    const mid = (low + high) / 2;
    if (presentValue(mid) > netAmount) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function buildSchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  totalMonths: number
): AmortizationRow[] {
  const cappedMonths = Math.min(totalMonths, MAX_SCHEDULE_MONTHS);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= cappedMonths; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    if (month === cappedMonths) {
      // Ajuste del último pago para cancelar exactamente el saldo restante
      principalPayment = balance;
    }
    balance = Math.max(balance - principalPayment, 0);
    rows.push({
      month,
      payment: interestPayment + principalPayment,
      interestPayment,
      principalPayment,
      remainingBalance: balance,
    });
  }
  return rows;
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

  const schedule = buildSchedule(
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
