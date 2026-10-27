// ---- "Conoce la tienda": galería con filtros y ampliación ----
// Para agregar o cambiar fotos: sube el archivo a img/tienda/ (grande: nombre.webp y miniatura: nombre-m.webp) y edita esta lista.
const FOTOS = [
  { n: 'fachada', c: 'tienda', t: 'Nuestra tienda', a: "Fachada de Perlitas Pet's, tienda de mascotas con peluquería y spa" },
  { n: 'pelu-panoleta', c: 'pelu', y: 70, t: 'Corte y pañoleta', a: 'Perro de pelaje dorado con pañoleta azul y moño, recién arreglado' },
  { n: 'pelu-flor', c: 'pelu', y: 22, t: 'Peinado con accesorios', a: 'Perro pequeño con collar rosa de flor y brillantes en las orejas' },
  { n: 'pelu-collage', c: 'pelu', y: 0, t: 'Resultado del corte', a: 'Collage de un perro con corte y pañoleta azul sobre la mesa de peluquería' },
  { n: 'pelu-corbatin', c: 'pelu', y: 60, t: 'Corte con corbatín', a: 'Perro de pelo largo con corte y corbatín rojo sobre pañoleta azul' },
  { n: 'pelu-gala', c: 'pelu', y: 50, t: 'Peinado de gala', a: 'Perro de pelo largo con moño alto, diadema y lazos dorados' },
  { n: 'pelu-navidad', c: 'pelu', y: 35, t: 'Arreglo navideño', a: 'Perro peludo con lazo navideño y brillantes' },
  { n: 'ropa', c: 'ropa', t: 'Ropa para mascotas', a: 'Ropa para perros en exhibición' },
  { n: 'snacks', c: 'cuidos', t: 'Snacks y premios', a: 'Pared con snacks y premios para perros y gatos' },
  { n: 'peceras-fachada', c: 'peceras', t: 'Peceras y acuarios', a: 'Entrada de la tienda con peceras en exhibición' },
  { n: 'peceras-exhibidor', c: 'peceras', t: 'Peces en exhibición', a: 'Mueble con peceras y peces de varias especies' },
  { n: 'peces', c: 'peceras', t: 'Peces ornamentales', a: 'Pecera con peces de colores' },
  { n: 'peceras-estantes', c: 'peceras', t: 'Acuarios decorados', a: 'Estantes con acuarios pequeños decorados' },
  { n: 'filtros', c: 'peceras', t: 'Filtros y accesorios', a: 'Estante con filtros, bombas de aire y accesorios para acuarios' }
];
const CATS = [['todo', 'Todo'], ['tienda', 'Tienda'], ['pelu', 'Peluquería'], ['ropa', 'Ropa y accesorios'], ['cuidos', 'Snacks y cuidos'], ['peceras', 'Peceras']];

(function () {
  const chips = document.getElementById('cats'), grid = document.getElementById('fgrid');
  const lb = document.getElementById('lb'), lbi = lb.querySelector('img'), lbt = lb.querySelector('p');
  let vis = [], cur = 0;
  chips.innerHTML = CATS.map(([k, l], i) => `<button type="button" class="chip${i ? '' : ' on'}" data-c="${k}">${l}</button>`).join('');
  function pintar(c) {
    vis = FOTOS.filter(f => c === 'todo' || f.c === c);
    grid.innerHTML = vis.map((f, i) => `<button type="button" class="foto" data-i="${i}"><img src="img/tienda/${f.n}-m.webp" alt="${f.a}" loading="lazy" style="object-position:center ${f.y || 50}%"><span>${f.t}</span></button>`).join('');
  }
  function abrir(i) {
    cur = (i + vis.length) % vis.length; const f = vis[cur];
    lbi.src = `img/tienda/${f.n}.webp`; lbi.alt = f.a; lbt.textContent = f.t;
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function cerrar() { lb.hidden = true; document.body.style.overflow = ''; }
  chips.onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    chips.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b)); pintar(b.dataset.c);
  };
  grid.onclick = e => { const b = e.target.closest('.foto'); if (b) abrir(+b.dataset.i); };
  lb.onclick = e => {
    const a = e.target.dataset.a;
    if (a === 'x' || e.target === lb) cerrar(); else if (a === 'p') abrir(cur - 1); else if (a === 'n') abrir(cur + 1);
  };
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') cerrar(); else if (e.key === 'ArrowLeft') abrir(cur - 1); else if (e.key === 'ArrowRight') abrir(cur + 1);
  });
  pintar('todo');
})();
