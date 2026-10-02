/**
 * app.js — lógica de la web pública.
 * La navegación es por pantallas (secciones con .screen), no scroll
 * largo: showScreen() oculta una y muestra otra con una transición
 * suave. Todo lo demás (modales, asesor, booking) es JS plano.
 */

document.addEventListener("DOMContentLoaded", () => {
  rellenarDatosNegocio();
  initRouter();
  initServiciosHome();
  initCortesYBarbas();
  initEquipo();
  initGaleria();
  initCompare();
  initAsesor();
  initFotoIA();
  initBooking();
  renderDestacadosHome();
});

// =========================================================
// Router de pantallas
// =========================================================
function initRouter() {
  document.querySelectorAll("[data-ir-a]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showScreen(el.getAttribute("data-ir-a"));
    });
  });

  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  burger.addEventListener("click", () => {
    const abierto = menu.classList.toggle("is-open");
    burger.classList.toggle("is-open", abierto);
  });
  menu.querySelectorAll("[data-ir-a]").forEach((a) =>
    a.addEventListener("click", () => { menu.classList.remove("is-open"); burger.classList.remove("is-open"); })
  );

  showScreen("inicio", true);
}

function showScreen(nombre, esInicial) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("is-active", s.id === "screen-" + nombre));
  document.querySelectorAll("[data-ir-a]").forEach((el) =>
    el.classList.toggle("is-active", el.getAttribute("data-ir-a") === nombre)
  );
  if (!esInicial) {
    document.querySelector(".screen.is-active").scrollIntoView({ block: "start" });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
}

// =========================================================
// Datos generales del negocio
// =========================================================
function rellenarDatosNegocio() {
  document.querySelectorAll("[data-negocio]").forEach((el) => {
    const campo = el.getAttribute("data-negocio");
    if (NEGOCIO[campo] !== undefined) el.textContent = NEGOCIO[campo];
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach((a) => (a.href = `https://wa.me/${NEGOCIO.whatsapp}`));
  document.querySelectorAll("[data-ig-link]").forEach((a) => (a.href = NEGOCIO.instagram));
  document.querySelectorAll("[data-maps-link]").forEach((a) => (a.href = LOCATION.mapsUrl));
  document.querySelectorAll("[data-location-address]").forEach((el) => (el.textContent = LOCATION.address));

  const horarioBox = document.querySelector("[data-horario-lista]");
  if (horarioBox) {
    horarioBox.innerHTML = LOCATION.horario
      .map((h) => `<div class="horario-row"><span>${h.dias}</span><span>${h.horas}</span></div>`)
      .join("");
  }

  const dh = document.querySelector("[data-detalle-humano]");
  if (dh) {
    dh.innerHTML = `
      <div class="detalle-item"><span class="dot"></span> Última cita libre hoy: <strong>${DETALLE_HUMANO.ultimaCitaHoy}</strong></div>
      <div class="detalle-item">Esta semana ya han pasado <strong>${DETALLE_HUMANO.clientesEstaSemana}</strong> clientes</div>
      <div class="detalle-item">El corte que más se pide: <strong>${DETALLE_HUMANO.corteMasPedido}</strong></div>
    `;
  }

  document.getElementById("hero-img").src = HERO_IMG;

  // Botón de reserva externa (Calendly, Google Calendar...): solo se
  // muestra si hay una URL configurada en CONFIG.reservaUrl.
  document.querySelectorAll("[data-reserva-externa]").forEach((el) => {
    if (CONFIG.reservaUrl) {
      el.href = CONFIG.reservaUrl;
      el.style.display = "inline-flex";
    } else {
      el.style.display = "none";
    }
  });
}

function renderDestacadosHome() {
  const cont = document.querySelector("[data-destacados-home]");
  if (!cont) return;
  const destacados = [CORTES[4], CORTES[0], CORTES[6]]; // degradado, buzz, crop
  cont.innerHTML = destacados.map((c) => tarjetaEstilo(c, "corte")).join("");
  cablearTarjetasEstilo(cont);
}

// =========================================================
// Servicios (pantalla propia)
// =========================================================
function initServiciosHome() {
  const grid = document.querySelector("[data-servicios-grid]");
  if (!grid) return;
  grid.innerHTML = SERVICIOS.map((s) => `
    <div class="servicio-pick" style="cursor:default;">
      <div>
        <strong style="font-family:'Fraunces',serif;font-size:1.05rem;">${s.nombre}</strong>
        <p style="margin:4px 0 0;font-size:0.85rem;max-width:40ch;">${s.descripcion}</p>
      </div>
      <div style="text-align:right;flex:none;margin-left:16px;">
        <div class="precio-tag" style="font-size:1.2rem;">${s.precio}€</div>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;" data-reservar-servicio="${s.id}">Reservar</button>
      </div>
    </div>
  `).join("");
  grid.querySelectorAll("[data-reservar-servicio]").forEach((btn) =>
    btn.addEventListener("click", () => abrirBooking({ servicioId: btn.getAttribute("data-reservar-servicio") }))
  );
}

// =========================================================
// Cortes y barbas
// =========================================================
let filtroActivo = "todos";

function tarjetaEstilo(item, tipo) {
  return `
    <div class="estilo-card" data-estilo-id="${item.id}" data-tipo="${tipo}" data-categoria="${item.categoria || ""}" tabindex="0">
      <div class="foto"><img src="${item.imagen}" alt="${item.nombre}" loading="lazy"></div>
      <div class="cuerpo">
        <h4>${item.nombre}</h4>
        <p class="resumen">${item.resumen}</p>
        <div class="precio-row">
          <span class="precio">${item.precio}€</span>
          <button class="btn btn-ghost btn-sm" data-ver-estilo="${item.id}" data-tipo="${tipo}">Ver estilo</button>
        </div>
      </div>
    </div>
  `;
}

function cablearTarjetasEstilo(root) {
  root.querySelectorAll("[data-estilo-id]").forEach((card) => {
    card.addEventListener("click", () => abrirModalEstilo(item_por_id(card.getAttribute("data-estilo-id"), card.getAttribute("data-tipo"))));
  });
}

function initCortesYBarbas() {
  const grid = document.querySelector("[data-cortes-grid]");
  if (grid) {
    grid.innerHTML = CORTES.map((c) => tarjetaEstilo(c, "corte")).join("");
    cablearTarjetasEstilo(grid);
  }
  document.querySelectorAll("[data-filtro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filtro]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      filtroActivo = btn.getAttribute("data-filtro");
      aplicarFiltro();
    });
  });

  const barbasGrid = document.querySelector("[data-barbas-grid]");
  if (barbasGrid) {
    barbasGrid.innerHTML = BARBAS.map((b) => tarjetaEstilo(b, "barba")).join("");
    cablearTarjetasEstilo(barbasGrid);
  }
}

function aplicarFiltro() {
  document.querySelectorAll("[data-estilo-id][data-categoria]").forEach((card) => {
    const coincide = filtroActivo === "todos" || card.getAttribute("data-categoria") === filtroActivo;
    card.classList.toggle("is-filtered-out", !coincide);
  });
}

function item_por_id(id, tipo) {
  return tipo === "barba" ? BARBAS.find((b) => b.id === id) : CORTES.find((c) => c.id === id);
}

// ---------- Modal de estilo ----------
function abrirModalEstilo(item) {
  const esBarba = BARBAS.some((b) => b.id === item.id);
  const modal = document.querySelector("[data-modal-estilo]");
  modal.querySelector("[data-modal-body]").innerHTML = `
    <div class="modal-img-main"><img src="${item.imagen}" alt="${item.nombre}"></div>
    <div class="modal-body">
      <h3>${item.nombre}</h3>
      <div class="modal-precio">${item.precio}€</div>
      <p>${item.descripcion}</p>
      <div class="para-quien"><strong>Para quién:</strong> ${item.paraQuien}</div>
      <div class="mantenimiento"><strong>Mantenimiento:</strong> ${item.mantenimiento}</div>
      <div class="modal-actions">
        <button class="btn btn-secondary" data-probar-corte="${item.id}" data-tipo="${esBarba ? "barba" : "corte"}">Probar este corte</button>
        <button class="btn btn-primary" data-pedir-cita-estilo="${item.id}" data-tipo="${esBarba ? "barba" : "corte"}">Pedir cita</button>
      </div>
    </div>
  `;
  modal.querySelector("[data-probar-corte]").addEventListener("click", () => {
    cerrarModal(modal);
    abrirFotoIA(item);
  });
  modal.querySelector("[data-pedir-cita-estilo]").addEventListener("click", () => {
    cerrarModal(modal);
    showScreen("reserva");
    abrirBookingEnPantalla({ servicioId: esBarba ? "barba" : "corte", estiloNombre: item.nombre });
  });
  abrirModal(modal);
}

function abrirModal(modal) { modal.classList.add("is-open"); document.body.style.overflow = "hidden"; }
function cerrarModal(modal) { modal.classList.remove("is-open"); document.body.style.overflow = ""; }
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-modal-close]") || e.target.matches(".modal-backdrop")) {
    cerrarModal(e.target.closest(".modal-backdrop") || e.target);
  }
});

// =========================================================
// Equipo
// =========================================================
function initEquipo() {
  const grid = document.querySelector("[data-equipo-grid]");
  if (!grid) return;
  grid.innerHTML = PELUQUEROS.map((p) => `
    <div class="peluquero-card">
      <div class="foto"><img src="${p.img}" alt="${p.nombre}" loading="lazy"></div>
      <div class="cuerpo">
        <h3 style="margin-bottom:2px;">${p.nombre}</h3>
        <span class="especialidad">${p.especialidad}</span>
        <p style="font-size:0.9rem;">${p.historia}</p>
        <div class="estilos">${p.dominaEstilos.map((e) => `<span>${e}</span>`).join("")}</div>
      </div>
    </div>
  `).join("");
}

// =========================================================
// Galería con lightbox
// =========================================================
let galeriaIndex = 0;
function initGaleria() {
  const grid = document.querySelector("[data-galeria-grid]");
  if (!grid) return;
  grid.innerHTML = GALERIA.map((g, i) => `
    <div class="galeria-item" data-index="${i}"><img src="${g.imagen}" alt="${g.alt}" loading="lazy"></div>
  `).join("");
  grid.querySelectorAll(".galeria-item").forEach((el) =>
    el.addEventListener("click", () => abrirLightbox(parseInt(el.getAttribute("data-index"), 10)))
  );

  const lb = document.querySelector("[data-lightbox]");
  lb.querySelector(".prev").addEventListener("click", () => moverLightbox(-1));
  lb.querySelector(".next").addEventListener("click", () => moverLightbox(1));
  lb.querySelector(".lightbox-close").addEventListener("click", () => lb.classList.remove("is-open"));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.classList.remove("is-open"); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") lb.classList.remove("is-open");
    if (e.key === "ArrowRight") moverLightbox(1);
    if (e.key === "ArrowLeft") moverLightbox(-1);
  });
}
function abrirLightbox(i) { galeriaIndex = i; pintarLightbox(); document.querySelector("[data-lightbox]").classList.add("is-open"); }
function moverLightbox(delta) { galeriaIndex = (galeriaIndex + delta + GALERIA.length) % GALERIA.length; pintarLightbox(); }
function pintarLightbox() {
  const item = GALERIA[galeriaIndex];
  const lb = document.querySelector("[data-lightbox]");
  lb.querySelector("img").src = item.imagen;
  lb.querySelector("p").textContent = item.alt;
}

// =========================================================
// Antes / Después
// =========================================================
function initCompare() {
  const compare = document.querySelector("[data-compare]");
  if (!compare) return;
  compare.querySelector("[data-before-img]").src = ANTES_DESPUES.antes;
  compare.querySelector("[data-after-img]").src = ANTES_DESPUES.despues;

  const afterWrap = compare.querySelector(".after-wrap");
  const handle = compare.querySelector(".handle");
  const setWidth = (pct) => {
    afterWrap.style.width = pct + "%";
    handle.style.left = pct + "%";
    const w = compare.clientWidth;
    afterWrap.querySelector("img").style.width = w + "px";
  };
  setWidth(50);

  let arrastrando = false;
  const mover = (clientX) => {
    const rect = compare.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    setWidth(pct);
  };
  handle.addEventListener("pointerdown", (e) => { arrastrando = true; handle.setPointerCapture(e.pointerId); });
  window.addEventListener("pointerup", () => (arrastrando = false));
  compare.addEventListener("pointermove", (e) => { if (arrastrando) mover(e.clientX); });
  compare.addEventListener("pointerdown", (e) => mover(e.clientX));
  window.addEventListener("resize", () => setWidth(parseFloat(handle.style.left) || 50));
}

// =========================================================
// "No sé qué hacerme"
// =========================================================
const asesorRespuestas = { largo: null, estilo: null, actual: null, barba: null };
let asesorPasoActual = 1;
const ASESOR_TOTAL_PASOS = 4;

function initAsesor() {
  const backdrop = document.querySelector("[data-asesor-backdrop]");
  if (!backdrop) return;
  document.querySelectorAll("[data-abrir-asesor]").forEach((b) => b.addEventListener("click", () => {
    asesorPasoActual = 1;
    Object.keys(asesorRespuestas).forEach((k) => (asesorRespuestas[k] = null));
    backdrop.querySelectorAll(".opt-btn").forEach((o) => o.classList.remove("is-selected"));
    pintarAsesor();
    abrirModal(backdrop);
  }));
  backdrop.querySelectorAll("[data-opt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const campo = btn.getAttribute("data-campo");
      asesorRespuestas[campo] = btn.getAttribute("data-opt");
      btn.parentElement.querySelectorAll(".opt-btn").forEach((o) => o.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      setTimeout(() => {
        if (asesorPasoActual < ASESOR_TOTAL_PASOS) { asesorPasoActual++; pintarAsesor(); }
        else mostrarResultadosAsesor();
      }, 220);
    });
  });
}

function pintarAsesor() {
  const backdrop = document.querySelector("[data-asesor-backdrop]");
  backdrop.querySelectorAll(".asesor-step").forEach((step) => {
    step.style.display = "";
    step.classList.toggle("is-active", parseInt(step.getAttribute("data-step"), 10) === asesorPasoActual);
  });
  backdrop.querySelectorAll(".asesor-progress span").forEach((s, i) => {
    s.classList.toggle("done", i + 1 < asesorPasoActual);
    s.classList.toggle("active", i + 1 === asesorPasoActual);
  });
  backdrop.querySelector("[data-asesor-resultado]").style.display = "none";
}

function mostrarResultadosAsesor() {
  const backdrop = document.querySelector("[data-asesor-backdrop]");
  backdrop.querySelectorAll(".asesor-step").forEach((s) => (s.style.display = "none"));
  const cont = backdrop.querySelector("[data-asesor-resultado]");
  cont.style.display = "block";
  backdrop.querySelectorAll(".asesor-progress span").forEach((s) => s.classList.add("done"));

  const candidatos = calcularRecomendaciones(asesorRespuestas);
  cont.innerHTML = `
    <h3>Te recomendamos</h3>
    <p>Por lo que nos has contado, creemos que estos estilos pueden encajarte:</p>
    ${candidatos.map((item) => `
      <div class="reco-card">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div>
          <h4 style="margin-bottom:4px;">${item.nombre}</h4>
          <p style="font-size:0.85rem;margin-bottom:0;">${item.porQue}</p>
          <div class="reco-actions">
            <button class="btn btn-secondary" data-ver-reco="${item.id}" data-tipo="${item.esBarba ? "barba" : "corte"}">Ver corte</button>
            <button class="btn btn-primary" data-probar-reco="${item.id}" data-tipo="${item.esBarba ? "barba" : "corte"}">Probar este corte</button>
          </div>
        </div>
      </div>
    `).join("")}
    <button class="btn btn-ghost btn-block" data-asesor-repetir style="margin-top:8px;">Volver a empezar</button>
  `;
  cont.querySelectorAll("[data-ver-reco]").forEach((b) => b.addEventListener("click", () => {
    cerrarModal(backdrop);
    abrirModalEstilo(item_por_id(b.getAttribute("data-ver-reco"), b.getAttribute("data-tipo")));
  }));
  cont.querySelectorAll("[data-probar-reco]").forEach((b) => b.addEventListener("click", () => {
    cerrarModal(backdrop);
    abrirFotoIA(item_por_id(b.getAttribute("data-probar-reco"), b.getAttribute("data-tipo")));
  }));
  cont.querySelector("[data-asesor-repetir]").addEventListener("click", () => {
    asesorPasoActual = 1;
    Object.keys(asesorRespuestas).forEach((k) => (asesorRespuestas[k] = null));
    backdrop.querySelectorAll(".opt-btn").forEach((o) => o.classList.remove("is-selected"));
    pintarAsesor();
  });
}

function calcularRecomendaciones(r) {
  const puntuados = CORTES.map((c) => {
    let puntos = 0;
    if (r.largo && c.largo === r.largo) puntos += 2;
    if (r.estilo && c.estilo === r.estilo) puntos += 2;
    if (r.actual && mismoRango(c.largo, r.actual)) puntos += 1;
    return { ...c, puntos, porQue: razon(r), esBarba: false };
  });
  puntuados.sort((a, b) => b.puntos - a.puntos);
  let top = puntuados.slice(0, r.barba === "si" ? 2 : 3);
  if (r.barba === "si") {
    const barbaSugerida = BARBAS.find((b) => b.id === "barba-degradada") || BARBAS[0];
    top.push({ ...barbaSugerida, porQue: "Para completar el cambio, combina bien con el corte de arriba.", esBarba: true });
  }
  return top;
}
function mismoRango(largoCorte, actual) {
  const mapa = { corto: "poco", medio: "medio", largo: "mucho" };
  return mapa[actual] === largoCorte;
}
function razon(r) {
  if (r.estilo === "limpio") return "Queda muy limpio y pide poco mantenimiento, justo lo que buscas.";
  if (r.estilo === "atrevido") return "Tiene más personalidad, ideal si quieres que se note el cambio.";
  return "Se ve natural y es fácil de mantener día a día.";
}

// =========================================================
// Probar corte con foto + IA (demo 100% en el navegador)
// =========================================================
let fotoIAEstiloActual = null;
let fotoIAImagenOriginal = null;

function initFotoIA() {
  const backdrop = document.querySelector("[data-foto-ia-backdrop]");
  if (!backdrop) return;

  const input = backdrop.querySelector("[data-foto-ia-input]");
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fotoIAImagenOriginal = ev.target.result;
      pintarFotoIAPreview();
    };
    reader.readAsDataURL(file);
  });

  backdrop.querySelector("[data-foto-ia-generar]").addEventListener("click", generarPreviewIA);
  backdrop.querySelector("[data-foto-ia-otro]").addEventListener("click", () => { cerrarModal(backdrop); abrirModalCortesDesdeFotoIA(); });
  backdrop.querySelector("[data-foto-ia-reservar]").addEventListener("click", () => {
    cerrarModal(backdrop);
    showScreen("reserva");
    const esBarba = BARBAS.some((b) => b.id === fotoIAEstiloActual.id);
    abrirBookingEnPantalla({ servicioId: esBarba ? "barba" : "corte", estiloNombre: fotoIAEstiloActual.nombre });
  });
}

function abrirFotoIA(item) {
  fotoIAEstiloActual = item;
  fotoIAImagenOriginal = null;
  const backdrop = document.querySelector("[data-foto-ia-backdrop]");
  backdrop.querySelector("[data-foto-ia-estilo-nombre]").textContent = item.nombre;
  mostrarPasoFotoIA("subir");
  backdrop.querySelector("[data-foto-ia-input]").value = "";
  abrirModal(backdrop);
}
function abrirModalCortesDesdeFotoIA() { showScreen("cortes"); }

function mostrarPasoFotoIA(paso) {
  document.querySelectorAll("[data-foto-ia-paso]").forEach((p) =>
    p.style.display = p.getAttribute("data-foto-ia-paso") === paso ? "block" : "none"
  );
}

function pintarFotoIAPreview() {
  const wrap = document.querySelector("[data-foto-ia-preview-wrap]");
  wrap.innerHTML = `<img src="${fotoIAImagenOriginal}" alt="Tu foto">`;
  mostrarPasoFotoIA("preview");
}

function generarPreviewIA() {
  mostrarPasoFotoIA("cargando");
  generateHairPreview(fotoIAImagenOriginal, fotoIAEstiloActual).then((resultado) => {
    const wrap = document.querySelector("[data-foto-ia-resultado-wrap]");
    wrap.innerHTML = `<img src="${resultado}" alt="Vista previa con ${fotoIAEstiloActual.nombre}"><span class="foto-ia-badge">Vista previa (demo) · ${fotoIAEstiloActual.nombre}</span>`;
    mostrarPasoFotoIA("resultado");
  });
}

/**
 * generateHairPreview(imagenDataUrl, estilo)
 * -----------------------------------------------------------------
 * En AI_CONFIG.demoMode = true: procesa la imagen en el propio
 * navegador con <canvas> (viñeta + tono de color según el estilo) para
 * dar una experiencia visual real sin depender de ninguna API.
 *
 * Cuando haya backend: cambiar AI_CONFIG.demoMode a false y esta misma
 * función pasa a hacer fetch(AI_CONFIG.endpoint, { method: "POST",
 * body: FormData con la imagen + estilo }). Nunca debe haber una API
 * key de generación de imágenes en este fichero ni en ningún otro
 * fichero del frontend: la key vive solo en el backend/serverless que
 * atienda ese endpoint.
 */
function generateHairPreview(imagenDataUrl, estilo) {
  if (!AI_CONFIG.demoMode) {
    return fetch(AI_CONFIG.endpoint, {
      method: "POST",
      body: (() => { const fd = new FormData(); fd.append("estilo", estilo.id); return fd; })()
    }).then((r) => r.json()).then((data) => data.imagenResultado);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 480;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");

      const lado = Math.min(img.width, img.height);
      const sx = (img.width - lado) / 2, sy = (img.height - lado) / 2;
      ctx.drawImage(img, sx, sy, lado, lado, 0, 0, size, size);

      // Tono de marca superpuesto, a modo de "vista previa de estilo".
      ctx.fillStyle = "rgba(62, 75, 59, 0.22)";
      ctx.fillRect(0, 0, size, size);

      // Viñeta suave para dar aspecto de "render".
      const grad = ctx.createRadialGradient(size/2, size/2, size*0.25, size/2, size/2, size*0.7);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      setTimeout(() => resolve(canvas.toDataURL("image/jpeg", 0.9)), 1400);
    };
    img.src = imagenDataUrl;
  });
}

// =========================================================
// Reserva de cita
// =========================================================
const booking = {
  servicioId: null, peluqueroId: "cualquiera", estiloNombre: null,
  fecha: null, hora: null, nombre: "", email: "", telefono: "",
  mesOffset: 0, paso: 1
};

function initBooking() {
  const panel = document.querySelector("#screen-reserva");
  if (!panel) return;

  panel.querySelector("[data-cal-prev]").addEventListener("click", () => { booking.mesOffset--; pintarCalendario(); });
  panel.querySelector("[data-cal-next]").addEventListener("click", () => { booking.mesOffset++; pintarCalendario(); });
  panel.querySelector("[data-booking-siguiente]").addEventListener("click", avanzarBooking);
  panel.querySelector("[data-booking-atras]").addEventListener("click", retrocederBooking);

  ["nombre", "email", "telefono"].forEach((campo) => {
    panel.querySelector(`[name="${campo}"]`).addEventListener("input", (e) => {
      booking[campo] = e.target.value;
      actualizarBotonSiguiente();
    });
  });

  panel.querySelector("[data-booking-confirmar]").addEventListener("click", confirmarCita);
  panel.querySelector("[data-booking-volver-inicio]").addEventListener("click", () => showScreen("inicio"));
}

function abrirBooking({ servicioId } = {}) {
  showScreen("reserva");
  abrirBookingEnPantalla({ servicioId });
}

function abrirBookingEnPantalla({ servicioId, estiloNombre } = {}) {
  booking.servicioId = servicioId || null;
  booking.peluqueroId = "cualquiera";
  booking.estiloNombre = estiloNombre || null;
  booking.fecha = null; booking.hora = null;
  booking.paso = 1;
  booking.mesOffset = 0;
  pintarServicios();
  pintarPeluqueros();
  pintarCalendario();
  pintarPasoBooking();
}

function pintarServicios() {
  const cont = document.querySelector("[data-servicio-pick-grid]");
  cont.innerHTML = SERVICIOS.map((s) => `
    <button class="servicio-pick ${booking.servicioId === s.id ? "is-selected" : ""}" data-pick-servicio="${s.id}">
      <span>${s.nombre}${booking.estiloNombre ? ` · ${booking.estiloNombre}` : ""}</span>
      <span class="precio-tag">${s.precio}€</span>
    </button>
  `).join("");
  cont.querySelectorAll("[data-pick-servicio]").forEach((btn) =>
    btn.addEventListener("click", () => { booking.servicioId = btn.getAttribute("data-pick-servicio"); pintarServicios(); actualizarBotonSiguiente(); })
  );
  actualizarBotonSiguiente();
}

function pintarPeluqueros() {
  const cont = document.querySelector("[data-peluquero-pick-grid]");
  const opciones = [{ id: "cualquiera", nombre: "Cualquiera disponible" }, ...PELUQUEROS];
  cont.innerHTML = opciones.map((p) => `
    <button class="peluquero-pick ${p.id === "cualquiera" ? "cualquiera" : ""} ${booking.peluqueroId === p.id ? "is-selected" : ""}" data-pick-peluquero="${p.id}">
      <span class="pp-info">
        ${p.img ? `<img src="${p.img}" alt="${p.nombre}">` : ""}
        <span class="pp-text"><strong>${p.nombre}</strong>${p.especialidad ? `<small>${p.especialidad}</small>` : ""}</span>
      </span>
    </button>
  `).join("");
  cont.querySelectorAll("[data-pick-peluquero]").forEach((btn) =>
    btn.addEventListener("click", () => { booking.peluqueroId = btn.getAttribute("data-pick-peluquero"); pintarPeluqueros(); })
  );
}

function pintarCalendario() {
  const cont = document.querySelector("[data-calendario-grid]");
  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth() + booking.mesOffset, 1);
  const nombreMes = base.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  document.querySelector("[data-cal-mes]").textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  const primerDiaSemana = (base.getDay() + 6) % 7;
  const diasEnMes = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

  let html = ["L","M","X","J","V","S","D"].map((d) => `<div class="dow">${d}</div>`).join("");
  for (let i = 0; i < primerDiaSemana; i++) html += `<div class="day empty"></div>`;

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(base.getFullYear(), base.getMonth(), dia);
    const iso = fechaISO(fecha);
    const esPasado = fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const esCerrado = fecha.getDay() === 0 || fecha.getDay() === 1;
    const disabled = esPasado || esCerrado;
    const seleccionado = booking.fecha === iso;
    html += `<button class="day ${disabled ? "disabled" : ""} ${seleccionado ? "is-selected" : ""}" data-fecha="${iso}" ${disabled ? "disabled" : ""}>${dia}</button>`;
  }
  cont.innerHTML = html;
  cont.querySelectorAll(".day[data-fecha]:not(.disabled)").forEach((btn) =>
    btn.addEventListener("click", () => {
      booking.fecha = btn.getAttribute("data-fecha"); booking.hora = null;
      pintarCalendario(); pintarHorarios(); actualizarBotonSiguiente();
    })
  );
  pintarHorarios();
}

function pintarHorarios() {
  const cont = document.querySelector("[data-horarios-grid]");
  const resumenFH = document.getElementById("resumen-fecha-hora");
  if (resumenFH) {
    resumenFH.innerHTML = booking.fecha
      ? `<div class="resumen-row"><span>Día elegido</span><span>${formatoFechaBonito(booking.fecha)}</span></div>`
      : `<div class="resumen-row"><span>Día elegido</span><span>—</span></div>`;
  }
  if (!booking.fecha) { cont.innerHTML = `<p style="grid-column:1/-1;color:var(--ink-soft);font-size:0.88rem;">Elige antes un día.</p>`; return; }
  const horarios = Store.horariosDelDia();
  cont.innerHTML = horarios.map((h) => {
    const ocupada = Store.horaOcupada(booking.fecha, h, booking.peluqueroId);
    const seleccionada = booking.hora === h;
    return `<button class="hora-btn ${ocupada ? "ocupada" : ""} ${seleccionada ? "is-selected" : ""}" data-hora="${h}" ${ocupada ? "disabled" : ""}>${h}</button>`;
  }).join("");
  cont.querySelectorAll(".hora-btn:not(.ocupada)").forEach((btn) =>
    btn.addEventListener("click", () => { booking.hora = btn.getAttribute("data-hora"); pintarHorarios(); actualizarBotonSiguiente(); })
  );
}

function servicioActual() { return SERVICIOS.find((s) => s.id === booking.servicioId); }
function peluqueroActual() { return PELUQUEROS.find((p) => p.id === booking.peluqueroId) || { id: "cualquiera", nombre: "Cualquiera disponible" }; }

function pintarPasoBooking() {
  const panel = document.querySelector("#screen-reserva");
  panel.querySelectorAll(".booking-step").forEach((step) => step.classList.toggle("is-active", parseInt(step.getAttribute("data-step"), 10) === booking.paso));
  panel.querySelectorAll(".booking-steps-bar span").forEach((s, i) => { s.classList.toggle("done", i + 1 < booking.paso); s.classList.toggle("active", i + 1 === booking.paso); });
  panel.querySelector("[data-booking-atras]").style.visibility = booking.paso === 1 ? "hidden" : "visible";
  panel.querySelector("[data-booking-footer]").style.display = booking.paso >= 6 ? "none" : "flex";
  if (booking.paso === 5) pintarResumenPrevio();
  actualizarBotonSiguiente();
}

function pintarResumenPrevio() {
  const cont = document.querySelector("[data-resumen-datos]");
  const s = servicioActual(), p = peluqueroActual();
  cont.innerHTML = `
    <div class="resumen-row"><span>Servicio</span><span>${s.nombre}${booking.estiloNombre ? " · " + booking.estiloNombre : ""}</span></div>
    <div class="resumen-row"><span>Peluquero</span><span>${p.nombre}</span></div>
    <div class="resumen-row"><span>Fecha</span><span>${formatoFechaBonito(booking.fecha)}</span></div>
    <div class="resumen-row"><span>Hora</span><span>${booking.hora}</span></div>
    <div class="resumen-row"><span>Precio</span><span>${s.precio}€</span></div>
  `;
}

function actualizarBotonSiguiente() {
  const btn = document.querySelector("[data-booking-siguiente]");
  if (!btn) return;
  let valido = true;
  if (booking.paso === 1) valido = !!booking.servicioId;
  if (booking.paso === 2) valido = !!booking.peluqueroId;
  if (booking.paso === 3) valido = !!booking.fecha;
  if (booking.paso === 4) valido = !!booking.hora;
  if (booking.paso === 5) valido = validarPasoDatos();
  btn.disabled = !valido;
  btn.textContent = booking.paso === 5 ? "Revisar y confirmar" : "Continuar";
}

function validarPasoDatos() {
  const nombreEl = document.querySelector('[name="nombre"]');
  const emailEl = document.querySelector('[name="email"]');
  if (!nombreEl) return false;
  booking.nombre = nombreEl.value; booking.email = emailEl.value;
  booking.telefono = document.querySelector('[name="telefono"]').value;
  return booking.nombre.trim().length > 1 && /\S+@\S+\.\S+/.test(booking.email) && booking.telefono.trim().length > 5;
}

function avanzarBooking() {
  if (booking.paso < 5) { booking.paso++; pintarPasoBooking(); }
  else if (booking.paso === 5) { booking.paso = 6; pintarPasoBooking(); pintarResumenFinal(); }
}
function retrocederBooking() { if (booking.paso > 1) { booking.paso--; pintarPasoBooking(); } }

function pintarResumenFinal() {
  const cont = document.querySelector("[data-resumen-final]");
  const s = servicioActual(), p = peluqueroActual();
  cont.innerHTML = `
    <div class="resumen-row"><span>Servicio</span><span>${s.nombre}${booking.estiloNombre ? " · " + booking.estiloNombre : ""}</span></div>
    <div class="resumen-row"><span>Peluquero</span><span>${p.nombre}</span></div>
    <div class="resumen-row"><span>Fecha</span><span>${formatoFechaBonito(booking.fecha)}</span></div>
    <div class="resumen-row"><span>Hora</span><span>${booking.hora}</span></div>
    <div class="resumen-row"><span>Nombre</span><span>${booking.nombre}</span></div>
    <div class="resumen-row"><span>Correo</span><span>${booking.email}</span></div>
    <div class="resumen-row"><span>Precio</span><span>${s.precio}€</span></div>
  `;
}

function confirmarCita() {
  const s = servicioActual(), p = peluqueroActual();
  const resultado = Store.crearCita({
    servicioId: s.id, servicioNombre: s.nombre + (booking.estiloNombre ? " · " + booking.estiloNombre : ""),
    precio: s.precio, peluqueroId: p.id, peluqueroNombre: p.nombre,
    fecha: booking.fecha, hora: booking.hora,
    nombre: booking.nombre, email: booking.email, telefono: booking.telefono
  });

  if (!resultado.ok) {
    alert(resultado.error + " Elige otra hora, por favor.");
    booking.paso = 4; pintarPasoBooking(); pintarHorarios();
    return;
  }

  booking.paso = 7;
  pintarPasoBooking();
  const cont = document.querySelector("[data-confirmacion]");
  cont.innerHTML = `
    <div class="confirmacion">
      <div class="check">✓</div>
      <h3 style="margin-bottom:2px;">Cita registrada</h3>
      <p style="margin-bottom:0;">Nos vemos, ${booking.nombre.split(" ")[0]}.</p>
      <div class="fecha-grande">${formatoFechaBonito(booking.fecha)} · ${booking.hora}</div>
      <p>${s.nombre}${booking.estiloNombre ? " · " + booking.estiloNombre : ""} · ${p.nombre} — ${s.precio}€</p>
      <div class="resumen-card" style="text-align:left;">
        <div class="resumen-row"><span>Nombre</span><span>${booking.nombre}</span></div>
        <div class="resumen-row"><span>Correo</span><span>${booking.email}</span></div>
        <div class="resumen-row"><span>Teléfono</span><span>${booking.telefono}</span></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px;">
        <a class="btn btn-secondary" href="${enlaceCalendario(resultado.cita)}" target="_blank" rel="noopener">Añadir a calendario</a>
        <button class="btn btn-primary" data-ir-a="inicio">Volver al inicio</button>
      </div>
    </div>
  `;
  cont.querySelector("[data-ir-a]").addEventListener("click", () => showScreen("inicio"));
}

function enlaceCalendario(cita) {
  const [y, m, d] = cita.fecha.split("-");
  const [hh, mm] = cita.hora.split(":");
  const inicio = `${y}${m}${d}T${hh}${mm}00`;
  const finDate = new Date(cita.fecha + "T" + cita.hora);
  finDate.setMinutes(finDate.getMinutes() + 30);
  const fin = finDate.toISOString().replace(/[-:]/g, "").split(".")[0];
  const detalles = encodeURIComponent(`Cita en ${NEGOCIO.nombre} — ${cita.servicioNombre}`);
  const loc = encodeURIComponent(LOCATION.address);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${detalles}&dates=${inicio}/${fin}&location=${loc}`;
}
