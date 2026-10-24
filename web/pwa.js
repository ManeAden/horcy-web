/* Horcy – version web : hors connexion, stockage durable, conseil d'installation sur iPhone. */
(function () {
  try { if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); } catch (e) {}
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  // Bandeau « Installer sur l'iPhone » : Safari, hors écran d'accueil, une fois par jour au plus
  try {
    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var standalone = window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    if (!ios || standalone) return;
    var LS = window.localStorage; var today = new Date().toDateString(); if (LS.getItem('horcyWeb:hint') === today) return;
    window.addEventListener('load', function () { setTimeout(function () {
      var d = document.createElement('div'); d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Installer Horcy');
      d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:99;background:#2a2f1f;color:#faf9f4;border-radius:16px;padding:14px 48px 14px 16px;font:14px/1.4 "DM Sans",sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)';
      var t = document.createElement('div'); t.innerHTML = '<b>Installer Horcy</b><br>Touchez <b>Partager</b> (carré avec une flèche) puis <b>Sur l’écran d’accueil</b>. Vos données seront ainsi conservées.'; d.appendChild(t);
      var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Fermer'); x.textContent = '×';
      x.style.cssText = 'position:absolute;top:6px;right:6px;width:40px;height:40px;border:0;background:transparent;color:#faf9f4;font-size:24px';
      x.onclick = function () { try { LS.setItem('horcyWeb:hint', today); } catch (e) {} d.remove(); }; d.appendChild(x);
      document.body.appendChild(d);
    }, 1200); });
  } catch (e) {}
})();
