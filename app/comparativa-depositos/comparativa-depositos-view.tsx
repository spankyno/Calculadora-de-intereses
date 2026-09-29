"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductsList } from "@/components/calculators/deposit-comparison/products-list";
import { ResultsSection } from "@/components/calculators/deposit-comparison/results-section";
import {
  createDefaultProduct,
  type DepositProduct,
} from "@/lib/calculators/deposit-comparison";

export function ComparativaDepositosView() {
  const [products, setProducts] = React.useState<DepositProduct[]>([
    createDefaultProduct("Producto 1", { annualRate: 3.5, openingFee: 0 }),
    createDefaultProduct("Producto 2", {
      annualRate: 3.2,
      capitalizationType: "compuesta",
      compoundingFrequency: "mensual",
      openingFee: 25,
    }),
  ]);

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            Comparativa · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Compara depósitos con condiciones reales
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Añade tantos productos como quieras, cada uno con su propio
            plazo, TIN, comisiones, retención y tipo de capitalización, y
            descubre cuál te deja realmente más dinero en el bolsillo.
          </p>
        </section>

        {/* Productos */}
        <section>
          <h2 className="mb-4 font-display text-xl font-medium tracking-tight">
            Productos a comparar
          </h2>
          <ProductsList products={products} onChange={setProducts} />
        </section>

        {/* Resultados */}
        <section className="mt-14 sm:mt-20">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Resultado de la comparativa
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se actualiza al instante según edites los productos de arriba.
            </p>
          </div>
          <ResultsSection products={products} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
