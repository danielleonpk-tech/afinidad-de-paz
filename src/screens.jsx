// Pantallas: bienvenida, demografía, priorización, ítems

const { useState: useState_s, useEffect: useEffect_s, useMemo: useMemo_s } = React;

// ─── Welcome ─────────────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  const [modal, setModal] = useState_s(null); // 'datos' | 'como' | null
  return (
    <div>
      <AppHeader />
      <Page footer={
        <div className="space-y-2.5">
          <PrimaryBtn onClick={onStart}>Comenzar</PrimaryBtn>
          <div className="flex items-center justify-between pt-1">
            <TextBtn onClick={()=>setModal('datos')}>Política de datos</TextBtn>
            <TextBtn onClick={()=>setModal('como')}>¿Cómo funciona?</TextBtn>
          </div>
        </div>
      }>
        <div className="fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Stamp tone="soft">Encuesta de afinidad</Stamp>
            <Stamp tone="olive">Eje paz · 2026</Stamp>
          </div>

          <h1 className="font-serif text-[34px] leading-[1.05] tracking-[-0.01em] text-ink-900 mb-4">
            ¿Con cuál candidato a la Presidencia coincides en <span className="italic">paz y conflicto armado</span>?
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-700 mb-5">
            Este ejercicio compara tus posiciones, ítem por ítem, con las de los cinco principales candidatos
            a la Presidencia de Colombia 2026, a partir del expediente verificado del Instituto CAPAZ.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { k:'5–7 min', v:'tiempo estimado' },
              { k:'16',      v:'afirmaciones' },
              { k:'5',       v:'candidatos' },
            ].map((s,i)=>(
              <div key={i} className="rounded-xl border border-ink-100 p-3 bg-paper-warm/40">
                <div className="font-serif text-2xl text-ink-900 leading-none">{s.k}</div>
                <div className="text-[11.5px] uppercase tracking-[0.1em] text-ink-500 mt-2">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-ink-100 bg-paper-warm/40 p-4 mb-2">
            <div className="text-[11.5px] uppercase tracking-[0.14em] text-ink-500 mb-2">Cómo funciona</div>
            <ol className="space-y-2 text-[13.5px] text-ink-800">
              {[
                'Cuatro datos demográficos para fines estadísticos.',
                'Eliges hasta tres dimensiones que más te importan.',
                'Respondes 16 afirmaciones en escala 1–5.',
                'Ves tu clasificación de afinidad y desglose por dimensión.',
              ].map((s,i)=>(
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-ink-500 mt-[3px]">0{i+1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-[12px] leading-relaxed text-ink-500 mt-5">
            Tu participación es <span className="text-ink-700">anónima</span>. Las respuestas se usan únicamente con fines de
            investigación agregada. Este ejercicio no es una encuesta de intención de voto ni una recomendación electoral.
          </p>
          <FootDisclaimer />
        </div>
      </Page>

      <Modal open={modal==='datos'} onClose={()=>setModal(null)} title="Política de datos">
        <p className="mb-3">Tu participación en este ejercicio es <span className="font-medium text-ink-900">anónima</span>. No recolectamos nombre, cédula, correo electrónico ni ningún dato que pueda identificarte.</p>
        <ul className="space-y-2 list-disc pl-4 mb-3">
          <li>Las respuestas se almacenan de forma agregada y se utilizan únicamente con fines de investigación académica del Instituto Colombo-Alemán para la Paz (CAPAZ).</li>
          <li>Tus respuestas se guardan temporalmente en este dispositivo (almacenamiento local del navegador) para que puedas retomar la encuesta si la cierras por accidente. Puedes borrarlas en cualquier momento desde la pantalla de resultados.</li>
          <li>Este ejercicio no es una encuesta de intención de voto ni una recomendación electoral. Los resultados son orientativos y no predicen tu comportamiento de voto.</li>
          <li>El cálculo de afinidad se realiza completamente en tu dispositivo: la matriz de posiciones de los candidatos es pública y verificable.</li>
        </ul>
        <p className="text-ink-500 text-[12.5px]">Al continuar declaras haber leído y entendido estas condiciones.</p>
      </Modal>

      <Modal open={modal==='como'} onClose={()=>setModal(null)} title="¿Cómo funciona?">
        <ol className="space-y-3 mb-4">
          <li><span className="font-mono text-[11px] text-ink-500 mr-2">01</span><span className="text-ink-900 font-medium">Datos sociodemográficos.</span> Cuatro preguntas breves, solo con fines estadísticos.</li>
          <li><span className="font-mono text-[11px] text-ink-500 mr-2">02</span><span className="text-ink-900 font-medium">Priorización.</span> Eliges hasta tres dimensiones de las seis del instrumento. Las elegidas pesan ×1.5 en el cálculo final.</li>
          <li><span className="font-mono text-[11px] text-ink-500 mr-2">03</span><span className="text-ink-900 font-medium">Ítems de afinidad.</span> 16 afirmaciones, una por pantalla, en escala de 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo). Puedes marcar “No sabe / No responde” cuando no tengas opinión formada.</li>
          <li><span className="font-mono text-[11px] text-ink-500 mr-2">04</span><span className="text-ink-900 font-medium">Cálculo.</span> Se compara tu posición con la del candidato en cada ítem mediante la distancia normalizada <span className="font-mono text-[12px] text-ink-700">1 − |tú − candidato| / 4</span>. La afinidad global es el promedio ponderado por los pesos.</li>
          <li><span className="font-mono text-[11px] text-ink-500 mr-2">05</span><span className="text-ink-900 font-medium">Resultados.</span> Verás la clasificación de los cinco candidatos, el desglose por dimensión, y tus mayores coincidencias y distancias.</li>
        </ol>
        <p className="text-ink-500 text-[12.5px]">Tiempo estimado: 5 a 7 minutos.</p>
      </Modal>
    </div>
  );
}

// ─── Demographics ────────────────────────────────────────────────────────────

const AGES = ['18 a 24 años','25 a 34 años','35 a 44 años','45 a 54 años','55 a 64 años','65 años o más','Prefiero no responder'];
const GENDERS = ['Mujer','Hombre','No binario / otra','Prefiero no responder'];
const EDU = ['Primaria o menos','Secundaria','Técnico o tecnólogo','Universitario (pregrado)','Posgrado','Prefiero no responder'];

function DemographicsScreen({ value, onChange, onNext, onBack }) {
  const v = value;
  const ready = v.age && v.dept && v.gender && v.edu;
  const set = (k,val) => onChange({ ...v, [k]: val });

  return (
    <div>
      <AppHeader stepLabel="01 · Datos" />
      <Page footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={onNext} disabled={!ready}>Continuar</PrimaryBtn>
          <GhostBtn onClick={onBack}>Atrás</GhostBtn>
        </div>
      }>
        <div className="slide-in">
          <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">Sección 1</div>
          <h2 className="font-serif text-[26px] leading-tight text-ink-900 mb-2">Cuatro preguntas breves</h2>
          <p className="text-[14px] text-ink-700 leading-relaxed mb-6">
            Solo se usan con fines estadísticos. Ninguna respuesta se vincula a tu identidad.
          </p>

          <FieldGroup label="Rango de edad">
            <div className="grid grid-cols-2 gap-2">
              {AGES.map(a => (
                <ChoiceCard key={a} selected={v.age===a} onClick={()=>set('age',a)}>{a}</ChoiceCard>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Departamento de residencia">
            <select value={v.dept||''} onChange={e=>set('dept', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ink-100 bg-paper text-[14.5px] text-ink-900 focus:border-ink-700 focus:outline-none">
              <option value="" disabled>Selecciona un departamento…</option>
              {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FieldGroup>

          <FieldGroup label="Identidad de género">
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map(g => (
                <ChoiceCard key={g} selected={v.gender===g} onClick={()=>set('gender',g)}>{g}</ChoiceCard>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Nivel educativo más alto alcanzado">
            <div className="space-y-2">
              {EDU.map(e => (
                <ChoiceCard key={e} selected={v.edu===e} onClick={()=>set('edu',e)}>{e}</ChoiceCard>
              ))}
            </div>
          </FieldGroup>
        </div>
      </Page>
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">{label}</div>
      {children}
    </div>
  );
}

// ─── Prioritization ──────────────────────────────────────────────────────────

function PrioritizationScreen({ value, onChange, onNext, onBack, onSkip }) {
  const set = new Set(value);
  const toggle = (id) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    onChange([...next]);
  };
  const remaining = 3 - set.size;

  return (
    <div>
      <AppHeader stepLabel="02 · Priorización" />
      <Page footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={onNext}>Continuar</PrimaryBtn>
          <div className="flex items-center justify-between pt-1">
            <TextBtn onClick={onBack}>Atrás</TextBtn>
            <TextBtn onClick={onSkip}>Saltar esta pregunta</TextBtn>
          </div>
        </div>
      }>
        <div className="slide-in">
          <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">Sección 2</div>
          <h2 className="font-serif text-[26px] leading-tight text-ink-900 mb-2">¿Qué temas te importan más?</h2>
          <p className="text-[14px] text-ink-700 leading-relaxed mb-2">
            Elige <span className="text-ink-900 font-medium">hasta tres dimensiones</span> prioritarias.
            Las marcadas tendrán un peso ligeramente mayor (<span className="font-mono">×1.5</span>) en el cálculo de tu afinidad.
          </p>
          <div className="flex items-center gap-2 mb-5">
            <Stamp tone="soft">{set.size} de 3 elegidas</Stamp>
            {remaining > 0 && <span className="text-[11.5px] text-ink-500">Puedes elegir {remaining} más</span>}
          </div>

          <div className="space-y-2.5">
            {DIMENSIONS.map(d => (
              <MultiCard key={d.id} letter={d.id}
                selected={set.has(d.id)}
                disabled={set.size>=3 && !set.has(d.id)}
                onClick={()=>toggle(d.id)}
                title={d.label} sub={d.desc} />
            ))}
          </div>
        </div>
      </Page>
    </div>
  );
}

// ─── Item screen (one of 16) ─────────────────────────────────────────────────

function ItemScreen({ index, response, onAnswer, onBack, onSkipNS }) {
  const item = ITEMS[index];
  const dim  = DIMENSIONS.find(d => d.id===item.dim);
  const isNSNR = response === null && response !== undefined; // null specifically = NS/NR
  return (
    <div className="bg-paper">
      <AppHeader stepLabel={"03 · Afinidad"} />
      <ProgressBar current={index+1} total={ITEMS.length} />
      <Page footer={
        <div className="space-y-2">
          <button onClick={onSkipNS}
            className="w-full py-3 rounded-xl bg-paper text-ink-700 font-medium text-[13.5px] border border-ink-100 hover:bg-ink-50 transition">
            No sabe / No responde
          </button>
          <GhostBtn onClick={onBack}>{index===0 ? 'Volver a priorización' : 'Pregunta anterior'}</GhostBtn>
        </div>
      }>
        <div key={index} className="slide-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[11px] text-ink-500">DIM · {dim.id}</span>
            <span className="text-[11.5px] text-ink-700">{dim.short}</span>
            {item.inverse && <Stamp tone="olive">formulación inversa</Stamp>}
          </div>

          <div className="mb-1 text-[11.5px] uppercase tracking-[0.16em] text-ink-500">Ítem {item.n} de 16</div>
          <h2 className="font-serif text-[23px] leading-[1.2] text-ink-900 mb-6 text-balance" style={{ textWrap: 'balance' }}>
            {item.text}
          </h2>

          <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">¿Qué tan de acuerdo estás?</div>
          <div className="space-y-2">
            {LIKERT_LABELS.map(l => (
              <LikertButton key={l.v} value={l.v} label={l.label}
                selected={response === l.v}
                onClick={()=>onAnswer(l.v)} />
            ))}
          </div>
        </div>
      </Page>
    </div>
  );
}

Object.assign(window, {
  WelcomeScreen, DemographicsScreen, PrioritizationScreen, ItemScreen
});
