import { Fragrance, Review, Country } from './types';

export const FRAGRANCES: Fragrance[] = [
  { 
    id: "dia",
    name: "Día", 
    price: 59900,
    label: "Energy", 
    type: "Cítrico Aromático",
    shortDesc: "Fresco y limpio para el amanecer.", 
    desc: "Inspirado en la frescura de la Riviera Francesa, Día es una ráfaga de aire puro y energía cítrica. Diseñado para el hombre que inicia su jornada con determinación y claridad.",
    image: "https://i.ibb.co/gZVKWRKP/perfume-dia.png",
    notes: {
      top: "Bergamota de Calabria, Limón Siciliano",
      heart: "Lavanda de Grasse, Salvia Blanca",
      base: "Almizcle Blanco, Cedro"
    },
    sillage: "Moderada (1.5 metros)",
    occasion: "Uso diario, Oficina, Gimnasio",
    sensation: "Vigorizante, Pulcro, Dinámico",
    presentation: "30 ml",
    duration: "15 a 20 horas"
  },
  { 
    id: "noche",
    name: "Noche", 
    price: 59900,
    label: "Mystery", 
    type: "Amaderado Oriental",
    shortDesc: "Intenso y misterioso para la noche.", 
    desc: "Una fragancia profunda que captura el magnetismo de la oscuridad. Elegante y sofisticada, proyecta una aura de misterio irresistible que perdura hasta el amanecer.",
    image: "https://i.ibb.co/xK95nr4W/freepik-lessence-es-el-nombre-que-2816251835.png",
    notes: {
      top: "Pimienta Negra, Cardamomo",
      heart: "Cuero Suave, Incienso",
      base: "Ámbar, Sándalo"
    },
    sillage: "Media-Alta (2 metros)",
    occasion: "Salidas nocturnas, Citas, Eventos nocturnos",
    sensation: "Sensual, Enigmático, Audaz",
    presentation: "30 ml",
    duration: "15 a 20 horas"
  },
  { 
    id: "elegante",
    name: "Elegante", 
    price: 59900,
    label: "Power", 
    type: "Floral Amaderado",
    shortDesc: "Lujo y poder para los negocios.", 
    desc: "El aroma del éxito. Equilibrado, imponente y refinado. Es la elección indiscutible para reuniones de alto nivel donde la primera impresión lo es todo.",
    image: "https://i.ibb.co/WN1tQk2S/freepik-lessence-es-el-nombre-que-2816255103.png",
    notes: {
      top: "Iris de Toscana, Neroli",
      heart: "Vetiver, Geranio",
      base: "Pachulí, Haba Tonka"
    },
    sillage: "Alta (2.5 metros)",
    occasion: "Eventos formales, Galas, Reuniones de negocios",
    sensation: "Autoridad, Refinamiento, Exclusividad",
    presentation: "30 ml",
    duration: "15 a 20 horas"
  },
  { 
    id: "magnetismo",
    name: "Magnetismo", 
    price: 59900,
    label: "Attraction", 
    type: "Especiado Cálido / Ambarino",
    shortDesc: "Atracción pura con enfoque magnético.", 
    desc: "Cálido y envolvente, Magnetismo es una fragancia diseñada para la proximidad. Su composición crea una estela embriagadora que invita al acercamiento.",
    image: "https://i.ibb.co/pvShMK6H/freepik-lessence-es-el-nombre-que-2816258014.png",
    notes: {
      top: "Canela, Nuez Moscada",
      heart: "Tabaco de Pipa, Vainilla Bourbon",
      base: "Resina de Benjuí, Cuero"
    },
    sillage: "Cercana (Para la proximidad)",
    occasion: "Citas románticas, Encuentros cercanos",
    sensation: "Seductor, Acogedor, Provocador",
    presentation: "30 ml",
    duration: "15 a 20 horas"
  }
];

export const STAR_SET = {
  name: "Colección Signature (Set de 4)",
  id: "set-completo",
  shortDesc: "Un sistema completo de fragancias para cada faceta de tu vida.",
  desc: "No uses el mismo aroma todos los días. Ten el indicado para cada momento. La Colección Signature incluye nuestras 4 fórmulas maestras en una presentación de lujo diseñada para el hombre que sabe que los detalles marcan la diferencia.",
  presentation: "4 frascos de 30 ml c/u",
  duration: "15 a 20 horas por aplicación",
  image: "https://i.ibb.co/HfnzMwFK/freepik-ultra-highend-product-pho-2816326642.jpg",
  price: 120000,
  oldPrice: 239600
};

export const REVIEWS: Review[] = [
  { name: "Andrés M.", stars: 5, text: "El perfume de día me sorprendió muchísimo. Huele limpio, elegante y dura bastante en la ropa." },
  { name: "Juan C.", stars: 5, text: "Compré el set de 4 y la verdad sí vale la pena. Tienes una opción para cada momento." },
  { name: "Felipe R.", stars: 5, text: "El de atracción fue el que más me gustó. Varias personas me preguntaron qué usaba." },
  { name: "David T.", stars: 5, text: "La presentación se siente muy premium y los aromas no huelen genéricos." },
  { name: "Sebastián G.", stars: 5, text: "El de noche tiene una presencia muy buena. Lo usé para salir y duró mucho más de lo que esperaba." },
  { name: "Camilo P.", stars: 5, text: "Me gustó que cada fragancia tiene su personalidad. No se siente como comprar cuatro iguales." },
  { name: "Andrés R.", stars: 5, text: "El elegante me pareció perfecto para reuniones. Se siente sofisticado." },
  { name: "Mateo L.", stars: 5, text: "Se nota que no es el típico perfume de siempre. Tiene una identidad diferente." },
  { name: "Ricardo V.", stars: 5, text: "Soy coleccionista de fragancias y este set de L’ESSENCE DE GRASSE tiene una calidad que compite con marcas de nicho." },
  { name: "Oscar H.", stars: 5, text: "Increíble cómo cambia la percepción de la gente cuando usas el de Magnetismo. Totalmente recomendado." },
  { name: "Luis F.", stars: 5, text: "El servicio fue impecable y el envío a Medellín llegó rapidísimo. El empaque es de otro nivel." },
  { name: "Santiago D.", stars: 5, text: "Buscaba algo diferente para mi boda y Noche fue la elección perfecta. Elegancia pura." },
  { name: "Mauricio K.", stars: 5, text: "Llevo usando el set un mes y ya no quiero volver a mis perfumes comerciales. Esto es otra liga." },
  { name: "Enrique S.", stars: 5, text: "Pagar el 50% por los 4 frascos es la mejor inversión que he hecho en mi imagen personal este año." },
  { name: "Gabriel V.", stars: 5, text: "Vivo en Panamá y el pedido llegó sin problemas. La fijación es impresionante incluso en climas húmedos." }
];

export const COUNTRIES: Record<string, Country> = {
  COL: { 
    id: "COL", name: "Colombia", dialCode: "+57", currency: "COP", flag: "https://flagcdn.com/w80/co.png", rate: 1, symbol: "$",
    fields: [
      { id: "dept", label: "Departamento", placeholder: "Ej: Antioquia" },
      { id: "city", label: "Ciudad / Municipio", placeholder: "Ej: Medellín" }
    ]
  },
  PAN: { 
    id: "PAN", name: "Panamá", dialCode: "+507", currency: "USD", flag: "https://flagcdn.com/w80/pa.png", rate: 1 / 4000, symbol: "$",
    fields: [
      { id: "prov", label: "Provincia", placeholder: "Ej: Panamá" },
      { id: "city", label: "Ciudad / Distrito", placeholder: "Ej: San Miguelito" }
    ]
  },
  CRI: { 
    id: "CRI", name: "Costa Rica", dialCode: "+506", currency: "CRC", flag: "https://flagcdn.com/w80/cr.png", rate: 0.13, symbol: "₡",
    fields: [
      { id: "prov", label: "Provincia", placeholder: "Ej: San José" },
      { id: "cant", label: "Cantón", placeholder: "Ej: Escazú" },
      { id: "dist", label: "Distrito", placeholder: "Ej: San Rafael" }
    ]
  },
  SLV: { 
    id: "SLV", name: "El Salvador", dialCode: "+503", currency: "USD", flag: "https://flagcdn.com/w80/sv.png", rate: 1 / 4000, symbol: "$",
    fields: [
      { id: "dept", label: "Departamento", placeholder: "Ej: San Salvador" },
      { id: "muni", label: "Municipio / Ciudad", placeholder: "Ej: Soyapango" }
    ]
  }
};

export const PROFILE_QUESTIONS = [
  {
    q: "¿Cómo quieres que te perciban primero?",
    options: [
      { text: "Seguro y limpio", tags: ["Día"] },
      { text: "Misterioso", tags: ["Noche"] },
      { text: "Elegante y poderoso", tags: ["Elegante"] },
      { text: "Atractivo y magnético", tags: ["Magnetismo"] }
    ]
  },
  {
    q: "¿En qué momento quieres dejar más impacto?",
    options: [
      { text: "Durante el día", tags: ["Día"] },
      { text: "En la noche", tags: ["Noche"] },
      { text: "En eventos especiales", tags: ["Elegante"] },
      { text: "En momentos de atracción", tags: ["Magnetismo"] }
    ]
  },
  {
    q: "¿Qué tipo de presencia te representa más?",
    options: [
      { text: "Fresca y discreta", tags: ["Día"] },
      { text: "Intensa y envolvente", tags: ["Noche"] },
      { text: "Sofisticada y refinada", tags: ["Elegante"] },
      { text: "Cercana y provocadora", tags: ["Magnetismo"] }
    ]
  },
  {
    q: "¿Qué faceta tuya quieres potenciar más?",
    options: [
      { text: "Confianza", tags: ["Día"] },
      { text: "Intriga", tags: ["Noche"] },
      { text: "Estatus", tags: ["Elegante"] },
      { text: "Magnetismo", tags: ["Magnetismo"] }
    ]
  },
  {
    q: "¿Qué tan protagonista quieres que sea tu aroma?",
    options: [
      { text: "Suave", tags: ["Día"] },
      { text: "Medio", tags: ["Elegante"] },
      { text: "Notable", tags: ["Noche"] },
      { text: "Intenso", tags: ["Magnetismo"] }
    ]
  }
];
