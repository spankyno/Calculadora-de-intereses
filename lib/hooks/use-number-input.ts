"use client";

import { useCallback, useState } from "react";
import { parseSpanishNumber } from "@/lib/utils";

/**
 * Gestiona un input de texto que representa un número en formato español
 * (coma decimal), manteniendo el string tal como lo escribe el usuario
 * y exponiendo el valor numérico parseado para los cálculos.
 */
export function useNumberInput(initialValue: number) {
  const [raw, setRaw] = useState(String(initialValue).replace(".", ","));

  const value = parseSpanishNumber(raw);

  const onChange = useCallback((next: string) => {
    // Solo permite dígitos, una coma decimal y espacios en blanco iniciales
    const sanitized = next.replace(/[^0-9,]/g, "");
    // Evita más de una coma
    const parts = sanitized.split(",");
    const clean =
      parts.length > 2 ? `${parts[0]},${parts.slice(1).join("")}` : sanitized;
    setRaw(clean);
  }, []);

  const setValue = useCallback((n: number) => {
    setRaw(String(n).replace(".", ","));
  }, []);

  return { raw, value, onChange, setValue };
}
