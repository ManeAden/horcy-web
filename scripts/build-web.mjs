// Construit le site Horcy (version web installable) dans dist/ à partir des écrans de app/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildAnimaux } from './build-animaux.mjs';

const OUT = 'dist';
fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['fonts', 'vendor', 'assets', 'exemple']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

// Polices et React en local : le site fonctionne hors connexion une fois ouvert.
const FONTS = [['playfair-display', 'Playfair Display', [600, 700]], ['dm-sans', 'DM Sans', [400, 500, 700]]];
let css = '';
for (const [pkg, family, weights] of FONTS) for (const w of weights) {
  const dir = path.join('node_modules', '@fontsource', pkg, 'files');
  const file = fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => f === `${pkg}-latin-${w}-normal.woff2`) : null;
  if (!file) { console.warn('Police introuvable :', pkg, w); continue; }
  fs.copyFileSync(path.join(dir, file), path.join(OUT, 'fonts', file));
  css += `@font-face{font-family:"${family}";font-style:normal;font-weight:${w};font-display:swap;src:url("${file}") format("woff2")}\n`;
}
fs.writeFileSync(path.join(OUT, 'fonts', 'fonts.css'), css);
fs.copyFileSync(path.join('node_modules', 'react', 'umd', 'react.production.min.js'), path.join(OUT, 'vendor', 'react.production.min.js'));
fs.copyFileSync(path.join('node_modules', 'react-dom', 'umd', 'react-dom.production.min.js'), path.join(OUT, 'vendor', 'react-dom.production.min.js'));

const HEAD = [
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
  '<meta name="theme-color" content="#faf9f4">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="Horcy">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
  '<link rel="manifest" href="manifest.webmanifest">',
  '<link rel="apple-touch-icon" href="assets/icon-180.png">',
  '<link rel="icon" type="image/png" href="assets/favicon.png">',
  '<script src="vendor/react.production.min.js"></script>',
  '<script src="vendor/react-dom.production.min.js"></script>',
].join('');
const SAFE = '<style>.p{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}</style>';

let n = 0;
for (const f of fs.readdirSync('app').filter((x) => x.endsWith('.dc.html'))) {
  let s = fs.readFileSync(path.join('app', f), 'utf8');
  s = s.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2[^"]*">/g, '<link rel="stylesheet" href="fonts/fonts.css">');
  s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + HEAD);
  s = s.replace('<script src="./support.js"></script>', '<script src="./support.js"></script><script src="pwa.js"></script>');
  s = s.replace('</helmet>', SAFE + '</helmet>');
  // Version web : toujours la date et l'heure réelles de l'appareil
  s = s.replace('var real = !!(C && C.isNativePlatform && C.isNativePlatform());', 'var real = true;');
  fs.writeFileSync(path.join(OUT, f), s); n++;
}
fs.copyFileSync(path.join('app', 'support.js'), path.join(OUT, 'support.js'));
for (const f of fs.readdirSync('assets')) fs.copyFileSync(path.join('assets', f), path.join(OUT, 'assets', f));
for (const f of fs.readdirSync('exemple')) fs.copyFileSync(path.join('exemple', f), path.join(OUT, 'exemple', f));
fs.copyFileSync(path.join('web', 'pwa.js'), path.join(OUT, 'pwa.js'));
fs.copyFileSync(path.join('web', 'manifest.webmanifest'), path.join(OUT, 'manifest.webmanifest'));
fs.writeFileSync(path.join(OUT, 'index.html'), '<!doctype html><html lang="fr"><head><meta charset="utf-8">' + HEAD.replace(/<script[^>]*><\/script>/g, '') + '<title>Horcy</title></head><body style="background:#faf9f4"><script>location.replace("Main.dc.html")</script></body></html>');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// Service worker : met tout le site en cache (version = empreinte des fichiers)
const files = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (!/^(\.nojekyll|sw\.js)$/.test(e.name)) files.push(path.relative(OUT, p).split(path.sep).join('/')); } };
walk(OUT);
const h = crypto.createHash('sha1'); for (const f of files.sort()) h.update(f).update(fs.readFileSync(path.join(OUT, f)));
const ver = h.digest('hex').slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sw.js'), fs.readFileSync(path.join('web', 'sw.js'), 'utf8').replace('__VERSION__', ver).replace('__FILES__', JSON.stringify(['./'].concat(files.map((f) => './' + f)))));
console.log(`Site prêt dans dist/ : ${n} écrans, ${files.length} fichiers, version ${ver}.`);

// Version multi-animaux (après la version chevaux, qui ne la met pas dans son cache)
buildAnimaux(HEAD, SAFE);
