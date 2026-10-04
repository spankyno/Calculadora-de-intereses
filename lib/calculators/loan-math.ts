/**
 * Motor matemático compartido para préstamos con amortización francesa
 * (cuota constante). Lo usan tanto "Préstamo personal" como "Hipoteca",
 * y en el futuro "Amortización anticipada". Lógica pura, sin React.
 */

export interface LoanAmortizationRow {
  month: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}

export const MAX_SCHEDULE_MONTHS = 600; // 50 años, límite de seguridad

/**
 * Cuota mensual constante del sistema francés.
 * M = P × r × (1+r)^n / [(1+r)^n − 1], con caso especial para r = 0.
 */
export function calculateMonthlyPayment(
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
 * Nº de meses necesarios para amortizar `principal` con una cuota `payment`
 * a un tipo mensual `monthlyRate`. Es la inversa de calculateMonthlyPayment.
 * Devuelve Infinity si la cuota no llega a cubrir ni los intereses.
 */
export function calculateMonthsToPayOff(
  principal: number,
  monthlyRate: number,
  payment: number
): number {
  if (principal <= 0) return 0;
  if (payment <= 0) return Infinity;
  if (monthlyRate === 0) return principal / payment;
  const interestOnly = principal * monthlyRate;
  if (payment <= interestOnly) return Infinity;
  return -Math.log(1 - (monthlyRate * principal) / payment) / Math.log(1 + monthlyRate);
}

/**
 * Resuelve por bisección el tipo mensual efectivo `i` tal que el valor
 * actual de las cuotas, descontado a `i`, iguale el importe neto recibido.
 * Con esto se obtiene la TAE real (incluye el efecto de comisiones).
 */
export function solveEffectiveMonthlyRate(
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

/**
 * Genera el cuadro de amortización completo, mes a mes.
 */
export function buildAmortizationSchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  totalMonths: number,
  maxMonths: number = MAX_SCHEDULE_MONTHS
): LoanAmortizationRow[] {
  const cappedMonths = Math.max(0, Math.min(Math.round(totalMonths), maxMonths));
  const rows: LoanAmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= cappedMonths; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    if (month === cappedMonths || principalPayment > balance) {
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
    if (balance <= 0) break;
  }
  return rows;
}
