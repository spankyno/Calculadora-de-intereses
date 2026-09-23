export function SiteFooter() {
  return (
    <footer className="print:hidden">
      <div className="container flex flex-col gap-3 border-t border-border py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl leading-relaxed">
          Esta herramienta ofrece una estimación orientativa con fines
          informativos y no constituye asesoramiento financiero ni fiscal.
          Consulta siempre las condiciones exactas de tu entidad y la
          normativa fiscal vigente.
        </p>
        <p>
          © {new Date().getFullYear()} Calculadora de Intereses — hecho con
          Next.js
        </p>
      </div>
    </footer>
  );
}
