import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://braina.ai';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/*', '/api/*'], // Exemple de routes à ne pas indexer
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
