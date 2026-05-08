// Encuesta CAPAZ — datos canónicos del documento v1.1
// Matriz, ítems, dimensiones, candidatos.

const CANDIDATES = [
  { id: 'cepeda',     name: 'Iván Cepeda',           shortName: 'Iván Cepeda',      party: 'Pacto Histórico',          initials: 'IC', color: '#7A2A2A' },
  { id: 'fajardo',    name: 'Sergio Fajardo',        shortName: 'Sergio Fajardo',   party: 'Dignidad y Compromiso',    initials: 'SF', color: '#2F6B5E' },
  { id: 'lopez',      name: 'Claudia López',         shortName: 'Claudia López',    party: 'Imparables',               initials: 'CL', color: '#B0892F' },
  { id: 'valencia',   name: 'Paloma Valencia',       shortName: 'Paloma Valencia',  party: 'Centro Democrático',       initials: 'PV', color: '#3F4A5C' },
  { id: 'espriella',  name: 'Abelardo de la Espriella', shortName: 'A. de la Espriella', party: 'Defensores de la Patria', initials: 'AE', color: '#5A2A2F' },
];

const DIMENSIONS = [
  { id: 'A', label: 'Negociaciones con grupos armados', short: 'Negociaciones',
    desc: 'ELN, disidencias, Clan del Golfo' },
  { id: 'B', label: 'Implementación del Acuerdo de 2016', short: 'Acuerdo 2016',
    desc: 'Reforma rural, sistema integral, integralidad' },
  { id: 'C', label: 'Justicia transicional y JEP', short: 'JEP',
    desc: 'Estructura, reforma o eliminación del tribunal' },
  { id: 'D', label: 'Modelo de seguridad y uso de la fuerza', short: 'Seguridad',
    desc: 'Vía militar, Bukele, seguridad humana' },
  { id: 'E', label: 'Política antidrogas', short: 'Drogas',
    desc: 'Glifosato y sustitución de cultivos' },
  { id: 'F', label: 'Víctimas y reparación', short: 'Víctimas',
    desc: 'Equidad en el reconocimiento y reparación' },
];

// Ítems en el orden 1..16 con su dimensión.
const ITEMS = [
  { n:1,  dim:'A', tag:'estatus político',
    text:'El Estado debe reconocer estatus político a los grupos armados que demuestren voluntad real de negociar un acuerdo de paz.' },
  { n:2,  dim:'A', tag:'continuidad de la paz total',
    text:'El próximo gobierno debe continuar con los procesos de paz iniciados en este periodo, ajustando lo que no haya funcionado.' },
  { n:3,  dim:'A', tag:'sometimiento sin estatus político', inverse:true,
    text:'Frente a estructuras como el ELN, las disidencias o el Clan del Golfo, el Estado debe ofrecer únicamente sometimiento a la justicia, sin reconocimiento político.' },
  { n:4,  dim:'B', tag:'implementación íntegra',
    text:'La implementación del Acuerdo de Paz de 2016 con las FARC debe completarse en todos sus puntos.' },
  { n:5,  dim:'B', tag:'reforma rural integral',
    text:'El Estado debe acelerar la entrega de tierras y la formalización de predios rurales contemplada en el Acuerdo de Paz.' },
  { n:6,  dim:'B', tag:'Sistema Integral',
    text:'El Sistema Integral de Verdad, Justicia, Reparación y No Repetición —creado por el Acuerdo— debe mantenerse y fortalecerse.' },
  { n:7,  dim:'C', tag:'mantener la JEP',
    text:'La Jurisdicción Especial para la Paz (JEP) debe mantenerse en su forma actual para continuar investigando los crímenes del conflicto.' },
  { n:8,  dim:'C', tag:'reforma de la JEP / sala militar',
    text:'La JEP debe ser reformada para incluir una sala especial para la Fuerza Pública y mayores garantías procesales como la doble instancia.' },
  { n:9,  dim:'C', tag:'eliminación de la JEP', inverse:true,
    text:'La JEP debe ser eliminada y los casos pendientes trasladados a la justicia ordinaria.' },
  { n:10, dim:'D', tag:'reactivación militar',
    text:'El Estado debe reactivar de inmediato las órdenes de captura suspendidas y priorizar la confrontación militar contra los grupos armados.' },
  { n:11, dim:'D', tag:'modelo Bukele',
    text:'Colombia debería implementar un modelo de seguridad similar al de El Salvador, con megacárceles y mano dura, para reducir la violencia.' },
  { n:12, dim:'D', tag:'seguridad humana',
    text:'La inversión social en territorios afectados por la violencia es tan importante como la presencia militar para resolver el conflicto.' },
  { n:13, dim:'E', tag:'glifosato',
    text:'La fumigación aérea con glifosato debe usarse como herramienta principal contra los cultivos ilícitos de coca.' },
  { n:14, dim:'E', tag:'sustitución concertada',
    text:'El Estado debe priorizar la sustitución voluntaria y concertada de cultivos sobre la erradicación forzosa.' },
  { n:15, dim:'F', tag:'reparación equitativa',
    text:'El Estado debe reconocer y reparar a las víctimas de violaciones cometidas por agentes del Estado y por grupos paramilitares con la misma prioridad que a las víctimas de la guerrilla.' },
  { n:16, dim:'F', tag:'énfasis víctimas FARC', inverse:true,
    text:'El Estado debe priorizar a las víctimas de las FARC porque ese grupo cometió la mayor parte de los crímenes del conflicto armado.' },
];

// Matriz CANDIDATO × ÍTEM — sección 5 del documento (valores 1..5; null = NV).
// Filas siguen el orden de ITEMS (índice 0 = ítem 1).
const MATRIX = {
  cepeda:    [4,5,2,5,5,5,5,1,1,1,1,5,1,5,5,1],
  fajardo:   [2,1,4,4,4,4,3,3,1,4,2,4,2,4,4,2],
  lopez:     [1,1,5,4,4,4,4,2,1,4,3,4,1,3,4,2],
  valencia:  [1,1,4,2,3,2,1,5,2,5,4,3,5,1,2,5],
  espriella: [1,1,4,1,1,1,1,4,5,5,5,1,5,1,1,5],
};

const LIKERT_LABELS = [
  { v:1, label:'Totalmente en desacuerdo', short:'TD' },
  { v:2, label:'En desacuerdo',             short:'D'  },
  { v:3, label:'Ni de acuerdo ni en desacuerdo', short:'N' },
  { v:4, label:'De acuerdo',                short:'A'  },
  { v:5, label:'Totalmente de acuerdo',     short:'TA' },
];

const DEPARTAMENTOS = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bogotá D.C.','Bolívar','Boyacá','Caldas','Caquetá',
  'Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía','Guaviare','Huila','La Guajira',
  'Magdalena','Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia',
  'Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada','Resido fuera de Colombia','Prefiero no responder'
];

// ----- Algoritmo (sección 6) -----
function computeAffinity(userResponses, priorities, matrix, items) {
  // userResponses: array length 16 of {1..5} | null
  // priorities: Set of dimension ids
  const out = {};
  for (const cid of Object.keys(matrix)) {
    let sumW = 0;
    let sumWA = 0;
    let countAnswered = 0;
    let perDim = {}; // dim -> {sumW, sumWA}
    for (let i = 0; i < items.length; i++) {
      const u = userResponses[i];
      const c = matrix[cid][i];
      if (u == null) continue;
      if (c == null) continue;
      countAnswered++;
      const distance = Math.abs(u - c);
      const aff = 1 - distance / 4;
      const dim = items[i].dim;
      const weight = priorities.has(dim) ? 1.5 : 1.0;
      sumW += weight;
      sumWA += weight * aff;
      if (!perDim[dim]) perDim[dim] = { sumW: 0, sumWA: 0, n: 0 };
      perDim[dim].sumW += 1; // dimensional breakdown unweighted
      perDim[dim].sumWA += aff;
      perDim[dim].n += 1;
    }
    const global = sumW === 0 ? null : (sumWA / sumW) * 100;
    const dimMap = {};
    for (const d of Object.keys(perDim)) {
      dimMap[d] = (perDim[d].sumWA / perDim[d].sumW) * 100;
    }
    out[cid] = { global, perDim: dimMap, countAnswered };
  }
  return out;
}

function computeUnweightedAffinity(userResponses, matrix, items) {
  const empty = new Set();
  return computeAffinity(userResponses, empty, matrix, items);
}

// Coincidencias / distancias por candidato
function itemContributions(userResponses, candidateId, matrix, items) {
  const list = [];
  for (let i = 0; i < items.length; i++) {
    const u = userResponses[i];
    const c = matrix[candidateId][i];
    if (u == null || c == null) continue;
    const distance = Math.abs(u - c);
    const aff = 1 - distance / 4;
    list.push({ idx: i, item: items[i], userVal: u, candVal: c, distance, aff });
  }
  return list;
}

Object.assign(window, {
  CANDIDATES, DIMENSIONS, ITEMS, MATRIX, LIKERT_LABELS, DEPARTAMENTOS,
  computeAffinity, computeUnweightedAffinity, itemContributions,
});
