// Genera public/portal/config.js con las variables de entorno (Cloudflare las inyecta en el build).
// Se corre antes de "vite build" y el archivo generado NO se sube al repo.
import { writeFileSync, mkdirSync } from 'node:fs';
const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';
if (!url || !key) console.warn('[portal] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY: el portal no va a poder conectarse.');
mkdirSync('public/portal', { recursive: true });
writeFileSync('public/portal/config.js', `window.PORTAL_CONFIG = ${JSON.stringify({ url, key })};\n`);
console.log('[portal] config.js generado');
