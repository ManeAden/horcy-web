// Construit la version multi-animaux dans dist/animaux/ à partir des écrans de app-animaux/.
// Même adresse de site que la version chevaux : les données sont séparées (préfixe horcyM: et base horcyM-files),
// le cache hors connexion aussi (service worker propre au dossier animaux/).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function buildAnimaux(HEAD, SAFE) {
  const ROOT = 'dist', OUT = path.join(ROOT, 'animaux');
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const d of ['fonts', 'vendor', 'assets']) { fs.mkdirSync(path.join(OUT, d), { recursive: true }); for (const f of fs.readdirSync(path.join(ROOT, d))) fs.copyFileSync(path.join(ROOT, d, f), path.join(OUT, d, f)); }
  const ns = (s) => s.split('horcy:').join('horcyM:').split('horcyN:').join('horcyMN:').split('horcy-files').join('horcyM-files');
  let n = 0;
  for (const f of fs.readdirSync('app-animaux').filter((x) => x.endsWith('.dc.html'))) {
    let s = fs.readFileSync(path.join('app-animaux', f), 'utf8');
    s = s.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2[^"]*">/g, '<link rel="stylesheet" href="fonts/fonts.css">');
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + HEAD.replace('Horcy', 'Horcy animaux'));
    s = s.replace('<script src="./support.js"></script>', '<script src="./support.js"></script><script src="pwa.js"></script>');
    s = s.replace('</helmet>', SAFE + '</helmet>');
    s = s.replace('var real = !!(C && C.isNativePlatform && C.isNativePlatform());', 'var real = true;');
    s = ns(s);
    if (f === 'MonEcurie.dc.html') {
      // Sauvegardes : mêmes clés « horcy: » que l'application, pour rester compatibles avec les autres versions.
      const a = "if (k.indexOf('horcyM:') === 0 && !this.bkSkip(k)) data[k] = LS.getItem(k);";
      const b = "Object.keys(p.data).forEach((k) => { if (k.indexOf('horcyM:') === 0) LS.setItem(k, String(p.data[k])); });";
      if (!s.includes(a) || !s.includes(b)) throw new Error('MonEcurie : export/import introuvables');
      s = s.replace(a, "if (k.indexOf('horcyM:') === 0 && !this.bkSkip(k)) data['horcy:' + k.slice(7)] = LS.getItem(k);");
      s = s.replace(b, "Object.keys(p.data).forEach((k) => { const j = k.indexOf(':'); const pre = k.slice(0, j); if (pre === 'horcy' || pre === 'horcyM') LS.setItem('horcyM:' + k.slice(j + 1), String(p.data[k])); });");
    }
    fs.writeFileSync(path.join(OUT, f), s); n++;
  }
  fs.copyFileSync(path.join('app', 'support.js'), path.join(OUT, 'support.js'));
  fs.copyFileSync(path.join('web', 'pwa.js'), path.join(OUT, 'pwa.js'));
  fs.copyFileSync(path.join('web', 'animaux.webmanifest'), path.join(OUT, 'manifest.webmanifest'));
  fs.writeFileSync(path.join(OUT, 'index.html'), '<!doctype html><html lang="fr"><head><meta charset="utf-8">' + HEAD.replace('Horcy', 'Horcy animaux').replace(/<script[^>]*><\/script>/g, '') + '<title>Horcy animaux</title></head><body style="background:#faf9f4"><script>location.replace("Main.dc.html")</script></body></html>');
  const files = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name !== 'sw.js') files.push(path.relative(OUT, p).split(path.sep).join('/')); } };
  walk(OUT);
  const h = crypto.createHash('sha1'); for (const f of files.sort()) h.update(f).update(fs.readFileSync(path.join(OUT, f)));
  const ver = h.digest('hex').slice(0, 10);
  fs.writeFileSync(path.join(OUT, 'sw.js'), fs.readFileSync(path.join('web', 'sw-animaux.js'), 'utf8').replace('__VERSION__', ver).replace('__FILES__', JSON.stringify(['./'].concat(files.map((f) => './' + f)))));
  console.log(`Version multi-animaux prête dans dist/animaux/ : ${n} écrans, ${files.length} fichiers, version ${ver}.`);
}
