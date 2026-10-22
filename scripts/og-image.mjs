/**
 * Gera public/og-image.png (1200×630), a imagem de compartilhamento do site.
 * Uso: node scripts/og-image.mjs   (requer @playwright/test e um Chromium/Edge)
 * Rode novamente se mudar o nome ou o título.
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; width:1200px; height:630px; background:#0c0e0f; color:#e6eae7;
         font-family: 'Segoe UI', Inter, system-ui, sans-serif; display:flex; }
  .wrap { margin:auto 88px; width:100%; }
  .cmd { font-family: Consolas, 'Cascadia Code', monospace; color:#85918d; font-size:28px; }
  .cmd b { color:#62d68e; }
  h1 { font-size:76px; line-height:1.05; margin:28px 0 18px; letter-spacing:-2px; }
  h1 span { color:#a3aeaa; font-weight:600; }
  p { font-size:30px; color:#a3aeaa; margin:0; }
  .bar { position:absolute; left:0; top:0; height:8px; width:100%; background:#62d68e; }
  .tags { margin-top:40px; display:flex; gap:12px; font-family: Consolas, monospace; font-size:22px; }
  .tags i { font-style:normal; border:1px solid #354043; border-radius:999px; padding:6px 16px; color:#a3aeaa; }
</style></head><body><div class="bar"></div><div class="wrap">
  <div class="cmd"><b>$</b> whoami</div>
  <h1>Alisson Abreu<br><span>Backend Developer · Python</span></h1>
  <p>APIs REST, bancos de dados, Redis e RabbitMQ</p>
  <div class="tags"><i>Python</i><i>Flask</i><i>SQL</i><i>Redis</i><i>RabbitMQ</i><i>Docker</i></div>
</div></body></html>`;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: out });
await browser.close();
console.log('ok:', out);
