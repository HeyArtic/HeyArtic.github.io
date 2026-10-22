import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const url = new URL(withBase(''), site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}</loc></url>
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
