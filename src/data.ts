export const COMPANY = {
  name: 'Grupo Amel',
  tagline: 'ADMINISTRACIÓN',
  phone: '11 2848-4488',
  phoneHref: 'tel:+5491128484488',
  whatsapp: 'https://wa.me/5491128484488',
  email: 'amel.consorcios@gmail.com',
  address: 'Ciudad Autónoma de Buenos Aires',
};

export const HERO_IMAGE = 'https://images.pexels.com/photos/11631278/pexels-photo-11631278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const PROMO_IMAGE = 'https://images.pexels.com/photos/8250872/pexels-photo-8250872.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const SERVICES = [
  {
    icon: 'ClipboardCheck',
    title: 'Informe inicial',
    description: 'Relevamos el estado del edificio y te entregamos un diagnóstico claro de sus problemas. Con ese informe armamos un plan de trabajo anual para cumplir la normativa vigente y los objetivos que defina la asamblea.',
  },
  {
    icon: 'Headset',
    title: 'Atención al cliente',
    description: 'Horario de atención: de 9 a 17 hs. Los propietarios pueden comunicarse por teléfono, WhatsApp o email. Hacemos seguimiento de cada reclamo hasta su resolución.',
  },
  {
    icon: 'Users',
    title: 'Control del personal',
    description: 'Definimos el plan de trabajo y los horarios del personal del edificio, a la vista de todos los propietarios, y proponemos alternativas para optimizar costos sin resentir el servicio.',
  },
  {
    icon: 'FileText',
    title: 'Contrataciones y aprobación de gastos',
    description: 'Cada trabajo o compra se decide comparando presupuestos y con aprobación del Consejo de Administración. Las facturas se pagan con la conformidad del trabajo realizado.',
  },
  {
    icon: 'Calculator',
    title: 'Liquidación de expensas',
    description: 'Liquidamos las expensas según la normativa vigente de la Ciudad de Buenos Aires y lo que establezca el Reglamento de Copropiedad.',
  },
  {
    icon: 'Scale',
    title: 'Gestión de morosidad',
    description: 'Para las unidades con pagos atrasados seguimos un procedimiento escalonado: aviso formal a partir del segundo mes, contacto telefónico al tercer mes, carta documento al cuarto mes y derivación a legales si no se regulariza.',
  },
  {
    icon: 'FolderArchive',
    title: 'Documentación del consorcio',
    description: 'Sueldos, cargas sociales, seguros, reparaciones y compras quedan documentados y disponibles para consulta de los propietarios en todo momento.',
  },
];

/* ------------------------------------------------------------------ */
/* Honorarios de referencia (CAPHyAI / AIERH) — vigencia oct-nov 2026  */
/* Actualizar cada bimestre: editar VIGENCIA y los montos de CLASES.   */
/* ------------------------------------------------------------------ */

export const VIGENCIA = 'octubre – noviembre 2026';

/** Límite superior de cada tramo de UF adicionales (el último es abierto). */
export const TRAMOS = [
  { desde: 21, hasta: 40, label: '21 a 40' },
  { desde: 41, hasta: 50, label: '41 a 50' },
  { desde: 51, hasta: 60, label: '51 a 60' },
  { desde: 61, hasta: 70, label: '61 a 70' },
  { desde: 71, hasta: 80, label: '71 a 80' },
  { desde: 81, hasta: 100, label: '81 a 100' },
  { desde: 101, hasta: Infinity, label: 'más de 100' },
];

export interface ClaseConsorcio {
  id: string;
  nombre: string;
  descripcion: string;
  minimo: number;          // honorario mínimo hasta 20 UF (A2: hasta 200 UF)
  minimoHastaUF: number;
  porUF: number[];         // valor por UF adicional, uno por cada TRAMO
}

export const CLASES: ClaseConsorcio[] = [
  {
    id: 'D', nombre: 'Clase D',
    descripcion: 'Viviendas sociales (FONAVI, BHN, institutos provinciales).',
    minimo: 486000, minimoHastaUF: 20,
    porUF: [22400, 18900, 16800, 15600, 13800, 11700, 10300],
  },
  {
    id: 'C', nombre: 'Clase C',
    descripcion: 'Edificios con servicios comunes (ascensor, limpieza, encargado).',
    minimo: 600000, minimoHastaUF: 20,
    porUF: [27600, 22800, 20100, 18100, 16400, 14800, 11700],
  },
  {
    id: 'B', nombre: 'Clase B',
    descripcion: 'Servicios comunes y/o centrales (calefacción, agua caliente, climatización o secarropas centrales).',
    minimo: 735000, minimoHastaUF: 20,
    porUF: [29500, 28000, 24600, 23300, 19900, 18200, 14800],
  },
  {
    id: 'A', nombre: 'Clase A',
    descripcion: 'Servicios comunes, centrales y de confort, hasta 2 amenities.',
    minimo: 969000, minimoHastaUF: 20,
    porUF: [30600, 29100, 27600, 25600, 24600, 22800, 19800],
  },
  {
    id: 'A1', nombre: 'Clase A1',
    descripcion: 'Servicios comunes, centrales, confort y súper confort: 3 o más amenities.',
    minimo: 1201000, minimoHastaUF: 20,
    porUF: [33700, 30600, 28800, 27700, 25900, 24600, 20900],
  },
  {
    id: 'A2', nombre: 'Clase A2',
    descripcion: 'Complejos o torres de 200 UF o más, con servicios de confort y súper confort.',
    minimo: 5942000, minimoHastaUF: 200,
    porUF: [],
  },
];

/** Tareas que no forman parte del honorario mensual y se cobran aparte. */
export const ARANCELES: { grupo: string; items: { concepto: string; valor: string }[] }[] = [
  {
    grupo: 'Certificaciones y trámites',
    items: [
      { concepto: 'Certificado de deuda de expensas', valor: '$103.000' },
      { concepto: 'DDJJ laborales, previsionales, fiscales o judiciales (por certificado)', valor: '$162.000' },
      { concepto: 'RPA – DDJJ anual por consorcio (Ley 941)', valor: '$210.000' },
      { concepto: 'RPA – Gestión de código QR / hipervínculo (Disp. 1146/24)', valor: '$54.000' },
      { concepto: 'Contestación de oficios administrativos o judiciales', valor: '$103.000' },
      { concepto: 'Asamblea extraordinaria pedida por el consorcio', valor: '$103.000' },
      { concepto: 'Asistencia a audiencia de mediación', valor: '$129.000' },
    ],
  },
  {
    grupo: 'Gestión administrativa y laboral',
    items: [
      { concepto: 'Convenio de pago por deuda de expensas', valor: '$161.000' },
      { concepto: 'Depósito por embargo de sueldos', valor: '10% (mín. $26.000)' },
      { concepto: 'ARCA (ex AFIP) – alta, baja o modificación', valor: '$45.000' },
      { concepto: 'CABA – DDJJ Registro de Empleadores', valor: '$193.000' },
      { concepto: 'ANSES – certificación de servicios y remuneraciones', valor: '$276.000' },
      { concepto: 'ART – liquidación de siniestro (por vez)', valor: '$81.000' },
      { concepto: 'Rendición final y traspaso de administración', valor: '$269.000' },
    ],
  },
];

export const FACTORES_HONORARIO = [
  { titulo: 'Unidades funcionales', texto: 'Es la base del cálculo. Cocheras y bauleras cuentan como media unidad.' },
  { titulo: 'Complejidad del edificio', texto: 'Ascensores, bombas, servicios centrales, amenities y personal a cargo.' },
  { titulo: 'Alcance del servicio', texto: 'Frecuencia de visitas, nivel de seguimiento y gestiones incluidas.' },
  { titulo: 'Estado inicial', texto: 'Deudas, documentación faltante u obras pendientes al tomar la administración.' },
];

export const CHECKLIST_COMPARAR = [
  'Qué incluye exactamente el honorario y qué se cobra aparte.',
  'Si hay comisiones sobre compras, proveedores u obras.',
  'Si la rendición mensual incluye el comprobante de cada gasto.',
  'Si el mantenimiento está incluido o se cobra a demanda.',
  'Comparar siempre con IVA incluido y calculando el costo anual, no solo el mensual.',
  'Pedir la propuesta por escrito, con el alcance detallado.',
];

export const FAQ = [
  {
    q: '¿Hay un arancel obligatorio para administrar un consorcio en CABA?',
    a: 'No. El honorario lo aprueba la asamblea. Como referencia se usan las tablas de honorarios sugeridos que publican las cámaras del sector y se actualizan cada dos meses.',
  },
  {
    q: '¿Cómo se calcula el honorario?',
    a: 'Se parte de un mínimo según la clase del edificio, que cubre hasta 20 unidades. Cada unidad adicional suma un valor por tramo (21 a 40, 41 a 50, etc.), que va bajando a medida que el edificio es más grande.',
  },
  {
    q: '¿Las cocheras y bauleras cuentan como unidad?',
    a: 'Cuentan como media unidad funcional cada una. Por ejemplo, 21 departamentos y 5 cocheras equivalen a 23,5 unidades.',
  },
  {
    q: '¿El honorario incluye IVA?',
    a: 'Los valores de referencia son sin IVA. Si el administrador es responsable inscripto se suma el 21%, por eso conviene comparar propuestas con IVA incluido.',
  },
  {
    q: '¿Qué tareas se cobran aparte?',
    a: 'Obras, gestiones judiciales, trámites especiales (certificados, oficios, DDJJ) y la rendición por traspaso. Se presupuestan por separado y requieren aprobación previa.',
  },
  {
    q: '¿Cómo controlo lo que cobra el administrador?',
    a: 'El honorario tiene que figurar todos los meses en la liquidación de expensas, como un rubro más. Podés verificarlo en cada liquidación.',
  },
];
