const wa = (t, n) => `https://wa.me/${n}?text=${encodeURIComponent(t)}`;
const NUM = { vet: CONFIG.WA_VET, pelu: CONFIG.WA_PELU };
const SALUDO = {
  vet: "Hola Perlitas Pet's, quiero información de veterinaria, cuidos o peceras.",
  pelu: "Hola Perlitas Pet's, quiero información de la peluquería canina."
};
document.querySelectorAll('[data-wa]').forEach(a => {
  const k = a.dataset.wa;
  a.href = wa(SALUDO[k], NUM[k]); a.target = '_blank'; a.rel = 'noopener';
});

// Menú móvil
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
menu.onclick = e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } };

// ---- Horario: L–S 8–19 · Domingos y lunes festivos 9–16 (hora de Colombia) ----
function pascua(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451), t = h + l - 7 * m + 114;
  return new Date(Date.UTC(y, Math.floor(t / 31) - 1, (t % 31) + 1));
}
const alLunes = d => new Date(d.getTime() + ((8 - d.getUTCDay()) % 7) * 864e5);
function lunesFestivos(y) { // Ley Emiliani: festivos trasladados al lunes
  const s = new Set(), iso = d => d.toISOString().slice(0, 10);
  [[0, 6], [2, 19], [5, 29], [7, 15], [9, 12], [10, 1], [10, 11]].forEach(([m, d]) => s.add(iso(alLunes(new Date(Date.UTC(y, m, d))))));
  [43, 64, 71].forEach(n => s.add(iso(new Date(pascua(y).getTime() + n * 864e5)))); // Ascensión, Corpus Christi, Sagrado Corazón
  return s;
}
function estado() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  const hora = (+p.hour % 24) + (+p.minute) / 60;
  const fest = lunesFestivos(+p.year).has(`${p.year}-${p.month}-${p.day}`);
  const [ab, ci] = (p.weekday === 'Sun' || fest) ? [9, 16] : [8, 19];
  const el = document.getElementById('estado');
  const abierto = hora >= ab && hora < ci;
  el.textContent = abierto ? `Abierto ahora · cerramos a las ${ci > 12 ? ci - 12 : ci}:00 p. m.` : 'Cerrado en este momento';
  el.classList.toggle('on', abierto);
}
estado(); setInterval(estado, 60000);

// ---- Galería automática (Instagram / Facebook) ----
const feed = document.getElementById('feed');
if (CONFIG.FEED_URL || CONFIG.FB_PAGE) {
  document.getElementById('feedFallback').hidden = true;
  if (CONFIG.FEED_URL) feed.insertAdjacentHTML('beforeend', `<iframe class="ig" src="${CONFIG.FEED_URL}" title="Últimas publicaciones de Instagram" loading="lazy" scrolling="no"></iframe>`);
  if (CONFIG.FB_PAGE) feed.insertAdjacentHTML('beforeend', `<iframe class="fb" src="https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(CONFIG.FB_PAGE)}&tabs=timeline&width=500&height=560&small_header=true&adapt_container_width=true" title="Publicaciones de Facebook" loading="lazy" scrolling="no"></iframe>`);
}

// ---- Reserva → WhatsApp (según el servicio) ----
const fec = document.getElementById('fec');
fec.min = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
document.getElementById('form').onsubmit = e => {
  e.preventDefault();
  const pelu = srv.value.startsWith('Peluquer');
  const msg = `Hola Perlitas Pet's, soy ${nom.value}. Quiero reservar ${srv.value} para ${mas.value} el ${fec.value}, en la ${fra.value}.`;
  window.open(wa(msg, pelu ? CONFIG.WA_PELU : CONFIG.WA_VET), '_blank', 'noopener');
};