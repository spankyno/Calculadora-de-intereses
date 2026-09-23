import { PiggyBank } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="print:hidden">
      <div className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-premium">
            <PiggyBank className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-display text-[17px] font-medium leading-none">
              Calculadora de Intereses
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Interés simple · España
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
