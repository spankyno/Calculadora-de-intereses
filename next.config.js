/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Redirección permanente (308) de la raíz a la calculadora principal.
      { source: "/", destination: "/depositos", permanent: true },
    ];
  },
};

module.exports = nextConfig;
