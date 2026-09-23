import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Añade separador de miles (punto) de forma determinista, sin depender
 * de las particularidades de Intl.NumberFormat en distintos motores ICU
 * (algunas versiones no agrupan números de 4 cifras en es-ES).
 */
function groupThousands(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toSpanishFixed(value: number, decimals: number): string {
  const isNegative = value < 0;
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = groupThousands(intPart);
  const result = decPart ? `${grouped},${decPart}` : grouped;
  return isNegative ? `-${result}` : result;
}

/**
 * Formatea un número como moneda en formato español: 1.234,56 €
 */
export function formatCurrency(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${toSpanishFixed(value, decimals)} €`;
}

/**
 * Formatea un número como porcentaje en formato español: 3,50 %
 */
export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${toSpanishFixed(value, decimals)} %`;
}

/**
 * Formatea un número plano en formato español: 1.234,56
 */
export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return toSpanishFixed(value, decimals);
}

/**
 * Convierte un string introducido por el usuario en formato español
 * ("1.234,56" o "1234,56" o "1234.56") a un número JS.
 */
export function parseSpanishNumber(input: string): number {
  if (!input) return NaN;
  let cleaned = input.trim().replace(/€|%/g, "").trim();

  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  if (hasComma && hasDot) {
    // 1.234,56 -> quitar puntos de miles, coma a punto decimal
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    // 1234,56 -> coma a punto decimal
    cleaned = cleaned.replace(",", ".");
  }
  // si solo tiene punto, se asume que ya es decimal estándar

  const n = parseFloat(cleaned);
  return n;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
