/**
 * data.js
 * -----------------------------------------------------------------
 * TODO lo editable del negocio vive aquí: precios, cortes, barbas,
 * peluqueros, ubicación y configuración. Cuando haya backend real,
 * esto es lo que se conecta a una base de datos — el resto del
 * código ya consume estos mismos objetos, así que no hay que tocar
 * la interfaz.
 *
 * FOTOGRAFÍAS: fotografías reales de barbería de un banco de imágenes
 * libre (Pexels — uso comercial permitido). No son fotos del local
 * concreto todavía: en cuanto haya sesión de fotos propia, se cambia
 * solo la URL de cada objeto, aquí abajo, y el resto del sitio sigue
 * funcionando igual.
 */

const NEGOCIO = {
  nombre: "Peluquería Ateneo",
  ciudad: "Gijón, Asturias",
  telefono: "+34 600 00 00 00",
  whatsapp: "34600000000",
  instagram: "https://instagram.com"
};

const LOCATION = {
  address: "Frente al Ateneo de La Calzada, Gijón, Asturias",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ateneo+de+la+Calzada+Gijon",
  horario: [
    { dias: "Martes a viernes", horas: "10:00 – 14:00 y 16:30 – 20:00" },
    { dias: "Sábados", horas: "10:00 – 14:00" },
    { dias: "Domingos y lunes", horas: "Cerrado" }
  ]
};

// Botón "Reservar online": si se rellena esta URL (Calendly, Google
// Calendar, etc.) el botón la abre en otra pestaña. Si se deja vacía,
// el botón queda oculto y solo se usa el sistema de reserva propio.
const CONFIG = {
  reservaUrl: ""
};

// Reservas: mientras demoMode sea true, todo se guarda en localStorage
// (ver store.js). El día que haya backend, demoMode pasa a false y
// bookingBackend apunta al endpoint real — el código que llama a
// Store.crearCita() no cambia.
const BOOKING_CONFIG = {
  demoMode: true,
  businessEmail: "hola@peluqueriaateneo.com",
  bookingBackend: null,
  horarios: ["10:00", "10:45", "11:30", "12:15", "17:00", "17:45", "18:30"]
};

// Prueba de corte con IA: en esta demo no se llama a ninguna API externa
// ni hay claves en el frontend. generateHairPreview() (en app.js) hace
// un procesado visual dentro del propio navegador. Cuando haya backend
// real, demoMode pasa a false y se llama por fetch a AI_CONFIG.endpoint
// (sin ninguna key en este fichero ni en el resto del código).
const AI_CONFIG = {
  demoMode: true,
  endpoint: "/api/generate-style"
};

const SERVICIOS = [
  { id: "corte", nombre: "Corte", precio: 14, duracion: 30,
    descripcion: "Lavado, corte y repaso final. El de toda la vida, bien hecho." },
  { id: "corte-barba", nombre: "Corte + Barba", precio: 20, duracion: 45,
    descripcion: "El combo que más se pide: corte completo y arreglo de barba." },
  { id: "barba", nombre: "Barba", precio: 10, duracion: 20,
    descripcion: "Perfilado, arreglo o afeitado a máquina y navaja." },
  { id: "corte-lavado", nombre: "Corte + Lavado", precio: 17, duracion: 35,
    descripcion: "Corte con lavado incluido, para salir con la cabeza despejada de verdad." }
];

const PELUQUEROS = [
  {
    id: "alex",
    nombre: "Álex",
    especialidad: "Fades, cortes modernos y estilos urbanos",
    historia: "Lleva el día a día de los degradados y los cortes que se ven en redes. Si quieres algo marcado y actual, es con quien hay que hablar.",
    dominaEstilos: ["Degradado", "Buzz Cut", "Mohicano", "Crop"],
    img: "https://images.pexels.com/photos/7697645/pexels-photo-7697645.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "marcos",
    nombre: "Marcos",
    especialidad: "Cortes clásicos, tijera y asesoramiento",
    historia: "El de los cortes de toda la vida hechos con calma. Si no tienes claro qué pedir, es buena idea empezar hablando con él.",
    dominaEstilos: ["Clásico", "Corte largo", "Texturizado"],
    img: "https://images.pexels.com/photos/7697287/pexels-photo-7697287.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "dani",
    nombre: "Dani",
    especialidad: "Barba, texturas y estilos personalizados",
    historia: "Se mueve bien entre barba y pelo largo, y le gusta probar cosas distintas si el cliente se anima.",
    dominaEstilos: ["Barba completa", "Barba degradada", "Mullet"],
    img: "https://images.pexels.com/photos/7697212/pexels-photo-7697212.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
];

// largo: poco | medio | mucho  ·  estilo: limpio | natural | atrevido
const CORTES = [
  {
    id: "buzz", nombre: "Buzz Cut", categoria: "cortos", largo: "poco", estilo: "limpio",
    imagen: "https://images.pexels.com/photos/7697225/pexels-photo-7697225.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 14, mantenimiento: "Muy bajo — repaso cada 3-4 semanas",
    resumen: "Cero mantenimiento, máxima limpieza.",
    descripcion: "Todo a una altura con máquina, sin despedidas ni juegos con las tijeras. El corte de quien no quiere pensar en el pelo entre semana y aun así quiere ir impecable.",
    paraQuien: "Para quien viaja mucho, hace deporte a diario o está cansado del peine."
  },
  {
    id: "mullet", nombre: "Mullet", categoria: "medios", largo: "medio", estilo: "atrevido",
    imagen: "https://images.pexels.com/photos/7697483/pexels-photo-7697483.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 16, mantenimiento: "Medio — forma cada 5-6 semanas",
    resumen: "Corto delante, con carácter detrás.",
    descripcion: "Laterales y parte de arriba controlados, algo más de largo en la nuca. Ha vuelto con fuerza y en Gijón se lleva más de lo que parece.",
    paraQuien: "Para quien no tiene miedo a que le miren dos veces por la calle."
  },
  {
    id: "mohicano", nombre: "Mohicano", categoria: "degradados", largo: "medio", estilo: "atrevido",
    imagen: "https://images.pexels.com/photos/7697315/pexels-photo-7697315.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 16, mantenimiento: "Medio-alto — retoque cada 3 semanas",
    resumen: "El de siempre, pero bien hecho.",
    descripcion: "Degradado marcado en los laterales y volumen trabajado en el centro. Suave para el día a día o marcado para salir.",
    paraQuien: "Para quien quiere destacar sin pasarse el día con cera en las manos."
  },
  {
    id: "clasico", nombre: "Clásico", categoria: "clasicos", largo: "medio", estilo: "limpio",
    imagen: "https://images.pexels.com/photos/7697661/pexels-photo-7697661.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 14, mantenimiento: "Bajo — dura bien 4-5 semanas",
    resumen: "El corte que nunca falla en una entrevista.",
    descripcion: "Tijera y peine, raya al lado o hacia atrás, acabado pulido. Se pide cuando quieres ir bien sin llamar la atención por el pelo.",
    paraQuien: "Para el día a día en la oficina, una boda o toda la vida."
  },
  {
    id: "degradado", nombre: "Degradado", categoria: "degradados", largo: "poco", estilo: "limpio",
    imagen: "https://images.pexels.com/photos/7697233/pexels-photo-7697233.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 15, mantenimiento: "Medio — retoque cada 3 semanas",
    resumen: "Limpio incluso a las dos semanas.",
    descripcion: "Fundido progresivo en los laterales que deja la parte de arriba con más cuerpo. Fácil de llevar y aguanta bien el paso de los días.",
    paraQuien: "Para quien quiere aguantar sin retoque el mayor tiempo posible."
  },
  {
    id: "texturizado", nombre: "Texturizado", categoria: "medios", largo: "medio", estilo: "natural",
    imagen: "https://images.pexels.com/photos/7697484/pexels-photo-7697484.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 16, mantenimiento: "Medio — forma cada 4-5 semanas",
    resumen: "Movimiento natural, nada de casco.",
    descripcion: "Se trabaja con tijera de entresacar para quitar peso y dejar el pelo con caída natural. Queda bien despeinado, que es justo el efecto que se busca.",
    paraQuien: "Para quien tiene el pelo rebelde y quiere aprovecharlo en vez de luchar contra él."
  },
  {
    id: "crop", nombre: "Crop", categoria: "cortos", largo: "poco", estilo: "natural",
    imagen: "https://images.pexels.com/photos/7697270/pexels-photo-7697270.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 15, mantenimiento: "Bajo-medio — retoque cada 4 semanas",
    resumen: "El favorito de los últimos años.",
    descripcion: "Flequillo corto y texturizado con laterales cortos o degradados. Sencillo, actual, queda bien tanto recién hecho como al tercer día.",
    paraQuien: "Para quien busca algo actual sin pasarse de moderno."
  },
  {
    id: "largo", nombre: "Corte largo", categoria: "largos", largo: "mucho", estilo: "natural",
    imagen: "https://images.pexels.com/photos/7697227/pexels-photo-7697227.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 16, mantenimiento: "Bajo — repaso de puntas cada 6-8 semanas",
    resumen: "Para quien se está dejando melena.",
    descripcion: "Repaso de puntas, forma y algo de capas para que no pese, manteniendo el largo. Ideal si llevas tiempo dejándotelo crecer.",
    paraQuien: "Para quien está en pleno proceso de dejárselo crecer y no quiere tirarlo por la borda."
  }
];

const BARBAS = [
  {
    id: "barba-corta", nombre: "Barba corta",
    imagen: "https://images.pexels.com/photos/7697279/pexels-photo-7697279.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 10, mantenimiento: "Perfilado cada 2 semanas",
    resumen: "Marcada, pero sin volumen.",
    descripcion: "Perfilado cerrado que deja la barba muy pegada, con línea limpia en cuello y pómulos.",
    paraQuien: "Para quien quiere barba pero sin que pese."
  },
  {
    id: "barba-degradada", nombre: "Barba degradada",
    imagen: "https://images.pexels.com/photos/7697672/pexels-photo-7697672.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 12, mantenimiento: "Retoque cada 2-3 semanas",
    resumen: "De la patilla a la barbilla, sin cortes bruscos.",
    descripcion: "Transición suave de longitud, pensada para combinar con un degradado en el pelo.",
    paraQuien: "Para combinar con un corte degradado y que todo tenga continuidad."
  },
  {
    id: "barba-completa", nombre: "Barba completa",
    imagen: "https://images.pexels.com/photos/7697642/pexels-photo-7697642.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 12, mantenimiento: "Forma cada 3-4 semanas",
    resumen: "Volumen controlado, nada de descuido.",
    descripcion: "Se mantiene el cuerpo pero se ordena la forma y se cuidan los bordes.",
    paraQuien: "Para quien ya tiene barba larga y quiere que se note que está cuidada."
  },
  {
    id: "perilla", nombre: "Perilla",
    imagen: "https://images.pexels.com/photos/7697229/pexels-photo-7697229.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 9, mantenimiento: "Perfilado semanal",
    resumen: "Pequeño detalle, gran diferencia.",
    descripcion: "Perfilado fino en barbilla y contorno de labio, sin entrar en mejillas.",
    paraQuien: "Para quien prefiere un toque discreto antes que una barba completa."
  },
  {
    id: "bigote", nombre: "Bigote",
    imagen: "https://images.pexels.com/photos/7697222/pexels-photo-7697222.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 8, mantenimiento: "Perfilado semanal",
    resumen: "El clásico que nunca pasa de moda.",
    descripcion: "Recorte y forma del bigote, con línea limpia sobre el labio.",
    paraQuien: "Para quien quiere ese punto clásico sin meterse en más barba."
  },
  {
    id: "barba-natural", nombre: "Barba natural",
    imagen: "https://images.pexels.com/photos/7697219/pexels-photo-7697219.jpeg?auto=compress&cs=tinysrgb&w=800",
    precio: 10, mantenimiento: "Repaso cada 3-4 semanas",
    resumen: "Se cuida, no se fuerza.",
    descripcion: "Se respeta el crecimiento natural, solo se ordenan bordes y se hidrata.",
    paraQuien: "Para quien no quiere una forma muy marcada, solo que esté cuidada."
  }
];

const GALERIA = [
  { imagen: "https://images.pexels.com/photos/7697644/pexels-photo-7697644.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Cliente a media sesión de corte" },
  { imagen: "https://images.pexels.com/photos/7697648/pexels-photo-7697648.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Repaso final con brocha" },
  { imagen: "https://images.pexels.com/photos/7697285/pexels-photo-7697285.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Detalle de herramientas de corte" },
  { imagen: "https://images.pexels.com/photos/7697645/pexels-photo-7697645.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Peluquero trabajando el degradado" },
  { imagen: "https://images.pexels.com/photos/7697212/pexels-photo-7697212.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Arreglo de barba en marcha" },
  { imagen: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Ambiente del local con varios clientes" },
  { imagen: "https://images.pexels.com/photos/7697233/pexels-photo-7697233.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Degradado recién terminado" },
  { imagen: "https://images.pexels.com/photos/7697270/pexels-photo-7697270.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Detalle de un crop recién hecho" }
];

const ANTES_DESPUES = {
  antes: "https://images.pexels.com/photos/7697661/pexels-photo-7697661.jpeg?auto=compress&cs=tinysrgb&w=900",
  despues: "https://images.pexels.com/photos/7697233/pexels-photo-7697233.jpeg?auto=compress&cs=tinysrgb&w=900"
};

const HERO_IMG = "https://images.pexels.com/photos/7697672/pexels-photo-7697672.jpeg?auto=compress&cs=tinysrgb&w=1200";

const DETALLE_HUMANO = {
  ultimaCitaHoy: "17:45",
  clientesEstaSemana: 38,
  corteMasPedido: "Degradado"
};
