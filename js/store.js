/**
 * store.js
 * -----------------------------------------------------------------
 * Capa de datos del sistema de citas. Con BOOKING_CONFIG.demoMode a
 * true (ver data.js), todo vive en localStorage y es completamente
 * funcional para hacer una demo real delante de un cliente: lo que se
 * reserva en index.html aparece al instante en administrador.html.
 *
 * El día que haya backend, solo hace falta reescribir crearCita(),
 * getCitas(), etc. para que hablen con BOOKING_CONFIG.bookingBackend
 * en vez de con localStorage — misma firma, mismo formato de datos,
 * así que ni index.html ni administrador.html tendrían que cambiar.
 */

const DB_KEYS = {
  citas: "ateneo_citas_v2",
  bloqueos: "ateneo_bloqueos_v2"
};

const Store = {
  _leer(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      console.error("Error leyendo", key, e);
      return [];
    }
  },
  _guardar(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // ---------- horarios ----------
  horariosDelDia() {
    return BOOKING_CONFIG.horarios;
  },

  horaOcupada(fecha, hora, peluqueroId) {
    const citas = this.getCitas();
    const ocupadaPorCita = citas.some(
      (c) => c.fecha === fecha && c.hora === hora && c.peluqueroId === peluqueroId && c.estado !== "cancelada"
    );
    const bloqueos = this._leer(DB_KEYS.bloqueos);
    const bloqueada = bloqueos.some(
      (b) => b.fecha === fecha && b.hora === hora && (b.peluqueroId === peluqueroId || b.peluqueroId === "todos")
    );
    return ocupadaPorCita || bloqueada;
  },

  // ---------- citas ----------
  getCitas() {
    return this._leer(DB_KEYS.citas);
  },

  crearCita({ servicioId, servicioNombre, precio, peluqueroId, peluqueroNombre, fecha, hora, nombre, email, telefono }) {
    if (!BOOKING_CONFIG.demoMode && BOOKING_CONFIG.bookingBackend) {
      // Punto de conexión futuro con el backend real.
      // return fetch(BOOKING_CONFIG.bookingBackend, {...})
    }
    if (this.horaOcupada(fecha, hora, peluqueroId)) {
      return { ok: false, error: "Ese horario ya no está disponible con este peluquero." };
    }
    const citas = this.getCitas();
    const cita = {
      id: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      servicioId, servicioNombre, precio,
      peluqueroId, peluqueroNombre,
      fecha, hora,
      nombre, email, telefono: telefono || "",
      estado: "confirmada", // confirmada | completada | cancelada
      creada: new Date().toISOString()
    };
    citas.push(cita);
    this._guardar(DB_KEYS.citas, citas);
    return { ok: true, cita };
  },

  cancelarCita(id) {
    const citas = this.getCitas().map((c) => (c.id === id ? { ...c, estado: "cancelada" } : c));
    this._guardar(DB_KEYS.citas, citas);
  },
  completarCita(id) {
    const citas = this.getCitas().map((c) => (c.id === id ? { ...c, estado: "completada" } : c));
    this._guardar(DB_KEYS.citas, citas);
  },

  // ---------- bloqueos manuales ----------
  getBloqueos() {
    return this._leer(DB_KEYS.bloqueos);
  },
  bloquearHorario(fecha, hora, peluqueroId) {
    const bloqueos = this.getBloqueos();
    if (!bloqueos.some((b) => b.fecha === fecha && b.hora === hora && b.peluqueroId === peluqueroId)) {
      bloqueos.push({ fecha, hora, peluqueroId });
      this._guardar(DB_KEYS.bloqueos, bloqueos);
    }
  },
  desbloquearHorario(fecha, hora, peluqueroId) {
    const bloqueos = this.getBloqueos().filter(
      (b) => !(b.fecha === fecha && b.hora === hora && b.peluqueroId === peluqueroId)
    );
    this._guardar(DB_KEYS.bloqueos, bloqueos);
  }
};

function fechaISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatoFechaBonito(fechaStr) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const fecha = new Date(y, m - 1, d);
  const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${dias[fecha.getDay()]} ${fecha.getDate()} ${meses[fecha.getMonth()]}`;
}
