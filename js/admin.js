/**
 * admin.js — panel del peluquero (administrador.html).
 * Lee y escribe sobre el mismo Store (localStorage) que la web
 * pública: una cita reservada en index.html aparece aquí al instante,
 * dentro del mismo navegador.
 */

let filtroPeluqueroActivo = "todos";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initFiltroPeluquero();
  pintarCitas();
  initBloqueos();
});

function initTabs() {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const destino = tab.getAttribute("data-tab");
      document.querySelectorAll("[data-panel]").forEach((p) => (p.style.display = p.getAttribute("data-panel") === destino ? "block" : "none"));
    });
  });
}

function initFiltroPeluquero() {
  const cont = document.querySelector("[data-filtro-peluquero]");
  const opciones = [{ id: "todos", nombre: "Todos" }, ...PELUQUEROS];
  cont.innerHTML = opciones.map((p) => `<button class="filtro-btn ${p.id === "todos" ? "is-active" : ""}" data-filtro-p="${p.id}">${p.nombre}</button>`).join("");
  cont.querySelectorAll("[data-filtro-p]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cont.querySelectorAll("[data-filtro-p]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      filtroPeluqueroActivo = btn.getAttribute("data-filtro-p");
      pintarCitas();
    });
  });
}

function pintarCitas() {
  const cont = document.getElementById("citas-lista");
  let citas = Store.getCitas();
  if (filtroPeluqueroActivo !== "todos") citas = citas.filter((c) => c.peluqueroId === filtroPeluqueroActivo);
  citas = citas.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  if (citas.length === 0) {
    cont.innerHTML = `<div class="vacio">Todavía no hay citas. En cuanto alguien reserve desde la web, aparecerá aquí.</div>`;
    return;
  }

  const porDia = {};
  citas.forEach((c) => { (porDia[c.fecha] = porDia[c.fecha] || []).push(c); });

  const hoyISO = fechaISO(new Date());
  const mananaISO = fechaISO(new Date(Date.now() + 86400000));

  cont.innerHTML = Object.keys(porDia).sort().map((fecha) => {
    let titulo = formatoFechaBonito(fecha);
    if (fecha === hoyISO) titulo = "Hoy · " + titulo;
    if (fecha === mananaISO) titulo = "Mañana · " + titulo;
    return `<div class="dia-bloque"><div class="dia-titulo">${titulo}</div>${porDia[fecha].map(filaCita).join("")}</div>`;
  }).join("");

  cont.querySelectorAll("[data-cancelar]").forEach((b) => b.addEventListener("click", () => { Store.cancelarCita(b.getAttribute("data-cancelar")); pintarCitas(); }));
  cont.querySelectorAll("[data-completar]").forEach((b) => b.addEventListener("click", () => { Store.completarCita(b.getAttribute("data-completar")); pintarCitas(); }));
}

function filaCita(c) {
  const badge = c.estado === "cancelada" ? `<span class="badge cancelada">Cancelada</span>`
    : c.estado === "completada" ? `<span class="badge">Completada</span>`
    : `<span class="badge">Confirmada</span>`;
  const acciones = c.estado === "confirmada"
    ? `<div class="cita-acciones"><button data-completar="${c.id}">Marcar completada</button><button data-cancelar="${c.id}">Cancelar</button></div>`
    : "";
  return `
    <div class="cita-row estado-${c.estado}">
      <div class="cita-info">
        <span class="hora">${c.hora}</span>
        <span class="cliente">${c.nombre}</span>
        <span class="meta">${c.servicioNombre} · ${c.precio}€</span>
        <span class="meta">con ${c.peluqueroNombre}</span>
        <span class="meta">${c.email}${c.telefono ? " · " + c.telefono : ""}</span>
        ${badge}
      </div>
      ${acciones}
    </div>`;
}

// ---------- Bloqueo manual de horarios ----------
function initBloqueos() {
  const selectHora = document.getElementById("bloq-hora");
  selectHora.innerHTML = BOOKING_CONFIG.horarios.map((h) => `<option value="${h}">${h}</option>`).join("");

  const selectPeluquero = document.getElementById("bloq-peluquero");
  selectPeluquero.innerHTML = `<option value="todos">Todos los peluqueros</option>` +
    PELUQUEROS.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("");

  document.getElementById("bloq-fecha").valueAsDate = new Date();

  document.getElementById("bloq-add").addEventListener("click", () => {
    const fecha = document.getElementById("bloq-fecha").value;
    if (!fecha) return;
    Store.bloquearHorario(fecha, selectHora.value, selectPeluquero.value);
    pintarBloqueos();
  });

  pintarBloqueos();
}

function pintarBloqueos() {
  const cont = document.getElementById("bloqueos-lista");
  const bloqueos = Store.getBloqueos();
  if (bloqueos.length === 0) { cont.innerHTML = `<div class="vacio">No hay horarios bloqueados manualmente.</div>`; return; }
  cont.innerHTML = bloqueos.map((b) => {
    const nombrePeluquero = b.peluqueroId === "todos" ? "todos" : (PELUQUEROS.find((p) => p.id === b.peluqueroId) || {}).nombre || b.peluqueroId;
    return `<span class="bloqueo-chip">${formatoFechaBonito(b.fecha)} · ${b.hora} · ${nombrePeluquero}
      <button data-unblock="${b.fecha}|${b.hora}|${b.peluqueroId}">✕</button></span>`;
  }).join("");
  cont.querySelectorAll("[data-unblock]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [fecha, hora, peluqueroId] = btn.getAttribute("data-unblock").split("|");
      Store.desbloquearHorario(fecha, hora, peluqueroId);
      pintarBloqueos();
    });
  });
}
