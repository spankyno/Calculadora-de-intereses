/**
 * Configuración centralizada del sitio. Un único lugar para la URL de
 * producción y los datos del autor, reutilizados en metadata (SEO),
 * sitemap, JSON-LD y el footer — para no repetirlos en varios archivos.
 *
 * ⚠️ Actualiza SITE_URL con el dominio real antes de desplegar a
 * producción: las URLs canónicas, el sitemap y las imágenes Open Graph
 * se resuelven a partir de este valor.
 */
export const SITE_URL = "https://calculadora-de-intereses-coral.vercel.app";

export const SITE_NAME = "Calculadora de Intereses";

export const AUTHOR = {
  name: "Aitor Sánchez Gutiérrez",
  blogUrl: "https://aitorsanchez.pages.dev/",
  contactUrl: "https://aitorsanchez.pages.dev/contacto",
  hubUrl: "https://aitorhub.vercel.app/",
};

export const MODULE_ROUTES = [
  "/depositos",
  "/interes-compuesto",
  "/tae-tin",
  "/comparativa-depositos",
  "/prestamo-personal",
  "/hipoteca",
  "/amortizacion-anticipada",
  "/letras-tesoro",
] as const;
