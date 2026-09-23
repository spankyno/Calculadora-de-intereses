import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Acerca de", href: "/acerca-de", external: false },
  {
    label: "Contacto",
    href: "https://aitorsanchez.pages.dev/contacto",
    external: true,
  },
  { label: "Blog", href: "https://aitorsanchez.pages.dev/", external: true },
  {
    label: "Más apps",
    href: "https://aitorhub.vercel.app/",
    external: true,
  },
];

export function SiteFooter() {
  return (
    <footer className="print:hidden">
      <div className="container flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Aitor Sánchez Gutiérrez © 2026 — Reservados todos los derechos
        </p>
        <nav aria-label="Enlaces del pie de página">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
