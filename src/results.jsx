// Pantalla de resultados — clasificación, desglose por dimensión, coincidencias/distancias

const { useState: useState_r, useEffect: useEffect_r, useMemo: useMemo_r } = React;

function letterFromValue(v) {
  return ({1:'TD',2:'D',3:'N',4:'A',5:'TA'})[v] || '—';
}
function fullFromValue(v) {
  return ({1:'Totalmente en desacuerdo',2:'En desacuerdo',3:'Ni de acuerdo ni en desacuerdo',4:'De acuerdo',5:'Totalmente de acuerdo'})[v] || '—';
}

function ResultsScreen({ state, onRestart, onBackToVoting }) {
  const { responses, priorities } = state;
  const prioritySet = useMemo_r(()=>new Set(priorities), [priorities]);

  const [unweighted, setUnweighted] = useState_r(false);
  const aff = useMemo_r(() => {
    return computeAffinity(responses, unweighted ? new Set() : prioritySet, MATRIX, ITEMS);
  }, [responses, prioritySet, unweighted]);

  const ranking = useMemo_r(() => {
    return CANDIDATES
      .map(c => ({ c, ...aff[c.id] }))
      .filter(r => r.global !== null)
      .sort((a,b) => b.global - a.global);
  }, [aff]);

  const top = ranking[0];
  const bottom = ranking[ranking.length-1];

  const answeredCount = responses.filter(r => r != null).length;
  const lowAnswer = answeredCount > 0 && answeredCount < ITEMS.length / 2;
  const noAnswer  = answeredCount === 0;

  if (noAnswer) {
    return (
      <div>
        <AppHeader stepLabel="Resultados" />
        <Page footer={<PrimaryBtn onClick={onBackToVoting}>Volver a responder</PrimaryBtn>}>
          <div className="slide-in mt-10">
            <Stamp tone="soft">Sin respuestas</Stamp>
            <h2 className="font-serif text-[28px] leading-tight text-ink-900 mt-3 mb-2">No podemos calcular tu afinidad</h2>
            <p className="text-[14.5px] text-ink-700">Marcaste “No sabe / No responde” en todos los ítems. Te invitamos a regresar y responder al menos algunos.</p>
          </div>
        </Page>
      </div>
    );
  }

  const topContribs = itemContributions(responses, top.c.id, MATRIX, ITEMS);
  const coincidences = [...topContribs].sort((a,b)=> b.aff - a.aff || a.distance - b.distance).slice(0,3);
  const bottomContribs = itemContributions(responses, bottom.c.id, MATRIX, ITEMS);
  const distances = [...bottomContribs].sort((a,b)=> b.distance - a.distance || a.aff - b.aff).slice(0,3);

  return (
    <div className="bg-paper">
      <AppHeader stepLabel="Resultados" />
      <main className="max-w-md mx-auto px-5 py-5">

        {/* Hero */}
        <section className="fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Stamp tone="soft">Tu afinidad</Stamp>
            {priorities.length>0 && <Stamp tone="olive">{priorities.length} prioridad{priorities.length>1?'es':''}</Stamp>}
          </div>
          <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-1">Tu candidato más afín en paz y conflicto</div>
          <h1 className="font-serif text-[36px] leading-none tracking-[-0.01em] text-ink-900">{top.c.name}</h1>
          <div className="text-[13.5px] text-ink-500 mt-1">{top.c.party}</div>

          <div className="mt-5 rounded-2xl border border-ink-100 bg-paper-warm/40 p-5">
            <div className="flex items-end justify-between mb-2">
              <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500">Afinidad programática</span>
              <span className="font-serif text-[44px] leading-none text-ink-900">
                {Math.round(top.global)}<span className="text-ink-500 text-[24px]">%</span>
              </span>
            </div>
            <ResultBar value={top.global} color={top.c.color} delayMs={250} height="h-2.5" />
            <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-500">
              <span><span className="font-mono text-ink-700">{answeredCount}</span> ítems respondidos</span>
              <span>·</span>
              <span>distancia media <span className="font-mono text-ink-700">
                {(topContribs.reduce((s,t)=>s+t.distance,0)/topContribs.length).toFixed(2)}
              </span> / 4</span>
            </div>
          </div>

          {lowAnswer && (
            <div className="mt-4 rounded-xl border border-olive-500/40 bg-olive-500/5 p-3 text-[12.5px] leading-relaxed text-ink-800">
              <span className="font-medium text-ink-900">Aviso:</span> tu afinidad se calculó con un número reducido de respuestas;
              los resultados son menos representativos.
            </div>
          )}
        </section>

        <Hairline className="my-7" />

        {/* Clasificación completa */}
        <section className="fade-in">
          <SectionTitle k="A" title="Clasificación completa" sub="Promedio ponderado de afinidad por ítem" />
          <div className="space-y-3.5 mt-4">
            {ranking.map((r, i) => (
              <RankRow key={r.c.id} idx={i+1} r={r} delay={150*i} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-[12px] text-ink-500">
            <button onClick={()=>setUnweighted(u=>!u)}
              className="text-[12.5px] underline decoration-ink-300 underline-offset-4 hover:text-ink-900">
              {unweighted ? 'Ver afinidad con tu ponderación' : 'Ver afinidad sin ponderación'}
            </button>
            <span className="font-mono text-[11px]">{unweighted ? 'pesos = 1' : '×1.5 en prioritarias'}</span>
          </div>
        </section>

        <Hairline className="my-7" />

        {/* Desglose por dimensión */}
        <section className="fade-in">
          <SectionTitle k="B" title="Desglose por dimensión" sub="Cómo te alineas con cada candidato en cada eje" />
          <DimensionMatrix ranking={ranking} responses={responses} prioritySet={prioritySet} />
        </section>

        <Hairline className="my-7" />

        {/* Coincidencias y distancias */}
        <section className="fade-in">
          <SectionTitle k="C" title="Inspección" sub="Tus mayores coincidencias y distancias" />

          <div className="mt-4">
            <SubHeader candidate={top.c} kind="coincidences" />
            <div className="space-y-2 mt-2">
              {coincidences.map((x,i)=>(
                <ContribRow key={i} contrib={x} candidate={top.c} kind="coincidence" />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <SubHeader candidate={bottom.c} kind="distances" />
            <div className="space-y-2 mt-2">
              {distances.map((x,i)=>(
                <ContribRow key={i} contrib={x} candidate={bottom.c} kind="distance" />
              ))}
            </div>
          </div>
        </section>

        <Hairline className="my-7" />

        {/* Disclaimer */}
        <section className="fade-in">
          <SectionTitle k="D" title="Cómo leer este resultado" />
          <p className="text-[13px] leading-relaxed text-ink-700 mt-3">
            Este resultado se basa exclusivamente en posiciones públicamente verificables de cada candidato sobre <span className="text-ink-900 font-medium">paz y conflicto armado</span>. No considera economía, salud, educación u otros temas. La afinidad programática es solo uno de los factores que influyen en el voto. Te invitamos a contrastar estos resultados con los programas completos de cada candidatura.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2">
            <GhostBtn onClick={()=>setUnweighted(u=>!u)}>{unweighted ? 'Aplicar ponderación' : 'Ver afinidad sin ponderación'}</GhostBtn>
            <GhostBtn onClick={onRestart}>Reiniciar la encuesta</GhostBtn>
          </div>

          <FootDisclaimer />
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ k, title, sub }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-mono text-[11px] text-ink-500">{k}.</span>
        <h3 className="font-serif text-[22px] leading-tight text-ink-900">{title}</h3>
      </div>
      {sub && <p className="text-[12.5px] text-ink-500">{sub}</p>}
    </div>
  );
}

function RankRow({ idx, r, delay=0 }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3.5 bg-paper">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[11px] text-ink-500 w-4 text-center">{idx}</div>
        <div className="shrink-0 w-9 h-9 rounded-full grid place-items-center text-paper font-medium text-[12.5px]"
             style={{ background: r.c.color }}>{r.c.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <div className="font-medium text-[15px] text-ink-900 truncate">{r.c.name}</div>
            <div className="font-serif text-[20px] leading-none text-ink-900">
              {Math.round(r.global)}<span className="text-ink-500 text-[12px]">%</span>
            </div>
          </div>
          <div className="text-[11.5px] text-ink-500 mb-1.5">{r.c.party}</div>
          <ResultBar value={r.global} color={r.c.color} delayMs={delay} height="h-1.5" />
        </div>
      </div>
    </div>
  );
}

// 6 dimensions × N candidates table — visualización mobile-friendly
function DimensionMatrix({ ranking, responses, prioritySet }) {
  return (
    <div className="mt-4 space-y-3">
      {DIMENSIONS.map(dim => {
        const isPriority = prioritySet.has(dim.id);
        return (
          <div key={dim.id} className={"rounded-xl border p-3.5 " +
            (isPriority ? 'border-olive-500/40 bg-olive-500/[0.04]' : 'border-ink-100 bg-paper')}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-ink-500">{dim.id}</span>
                <span className="font-medium text-[13.5px] text-ink-900">{dim.short}</span>
                {isPriority && <Stamp tone="olive">prioritaria</Stamp>}
              </div>
              <span className="text-[11px] text-ink-500">{dim.label.replace(dim.short, '').trim() || ''}</span>
            </div>
            <div className="space-y-2">
              {ranking.map((r, i) => {
                const v = r.perDim?.[dim.id];
                return (
                  <div key={r.c.id} className="flex items-center gap-3">
                    <div className="w-8 shrink-0">
                      <div className="w-7 h-7 rounded-full grid place-items-center text-paper font-medium text-[10.5px]"
                           style={{ background: r.c.color }}>{r.c.initials}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12.5px] text-ink-700 truncate">{r.c.shortName}</span>
                        <span className="font-mono text-[11.5px] text-ink-700">{v != null ? Math.round(v)+' %' : '—'}</span>
                      </div>
                      <ResultBar value={v ?? 0} color={r.c.color} delayMs={120*i} height="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubHeader({ candidate, kind }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full grid place-items-center text-paper text-[11px] font-medium" style={{background: candidate.color}}>{candidate.initials}</div>
      <div>
        <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500">
          {kind==='coincidences' ? 'Tus tres mayores coincidencias con' : 'Tus tres mayores distancias con'}
        </div>
        <div className="text-[14.5px] font-medium text-ink-900 leading-tight">{candidate.name}</div>
      </div>
    </div>
  );
}

function ContribRow({ contrib, candidate, kind }) {
  const c = contrib;
  return (
    <div className={"rounded-xl border p-3 " + (kind==='coincidence' ? 'border-ink-100 bg-paper' : 'border-ink-100 bg-paper')}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[11px] text-ink-500">Ítem {c.item.n}</span>
          <span className="text-[12px] text-ink-700 truncate">{c.item.tag}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={"font-mono text-[11px] px-1.5 py-0.5 rounded " +
            (kind==='coincidence' ? 'bg-ink-900 text-paper' : 'bg-olive-500/15 text-olive-600')}>
            {kind==='coincidence' ? Math.round(c.aff*100)+'%' : 'd='+c.distance}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-ink-700 leading-snug mb-3 line-clamp-3">{c.item.text}</p>
      <div className="grid grid-cols-2 gap-2">
        <PositionTag who="Tú" value={c.userVal} />
        <PositionTag who={candidate.shortName} value={c.candVal} candidateColor={candidate.color} />
      </div>
    </div>
  );
}

function PositionTag({ who, value, candidateColor }) {
  return (
    <div className="rounded-lg border border-ink-100 px-2.5 py-2 bg-paper-warm/40">
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500">{who}</div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="font-mono text-[11px] w-5 h-5 rounded grid place-items-center text-paper"
              style={{ background: candidateColor || '#161B22' }}>{value}</span>
        <span className="text-[12.5px] text-ink-900 leading-tight">{fullFromValue(value)}</span>
      </div>
    </div>
  );
}

Object.assign(window, { ResultsScreen });
