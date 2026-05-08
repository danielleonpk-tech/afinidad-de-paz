// App shell: state, navigation, persistence

const { useState: useState_a, useEffect: useEffect_a, useMemo: useMemo_a } = React;

const STORAGE_KEY = 'capaz_encuesta_v1.1';

const initialState = {
  step: 'welcome', // welcome | demo | priorities | items | vote | results
  itemIndex: 0,
  demo: { age: '', dept: '', gender: '', edu: '' },
  priorities: [], // dim ids
  responses: Array(16).fill(undefined), // undefined=unanswered; null=NS/NR; 1..5
  vote: { selfPlace: null, intent: null },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function App() {
  const [state, setState] = useState_a(() => loadState());

  useEffect_a(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // top of the page on step change
  useEffect_a(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [state.step, state.itemIndex]);

  const go = (patch) => setState(s => ({ ...s, ...patch }));

  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setState(initialState);
  };

  if (state.step === 'welcome') {
    return <WelcomeScreen onStart={() => go({ step: 'demo' })} />;
  }

  if (state.step === 'demo') {
    return (
      <DemographicsScreen
        value={state.demo}
        onChange={(demo) => setState(s => ({ ...s, demo }))}
        onBack={() => go({ step: 'welcome' })}
        onNext={() => go({ step: 'priorities' })}
      />
    );
  }

  if (state.step === 'priorities') {
    return (
      <PrioritizationScreen
        value={state.priorities}
        onChange={(priorities) => setState(s => ({ ...s, priorities }))}
        onBack={() => go({ step: 'demo' })}
        onNext={() => go({ step: 'items', itemIndex: 0 })}
        onSkip={() => setState(s => ({ ...s, priorities: [], step: 'items', itemIndex: 0 }))}
      />
    );
  }

  if (state.step === 'items') {
    const idx = state.itemIndex;
    const advance = (val) => {
      const responses = state.responses.slice();
      responses[idx] = val;
      const nextIdx = idx + 1;
      if (nextIdx >= ITEMS.length) {
        setState(s => ({ ...s, responses, step: 'vote' }));
      } else {
        setState(s => ({ ...s, responses, itemIndex: nextIdx }));
      }
    };
    const onAnswer = (v) => advance(v);
    const onSkipNS = () => advance(null);
    const onBack = () => {
      if (idx === 0) go({ step: 'priorities' });
      else go({ itemIndex: idx - 1 });
    };
    return (
      <ItemScreen
        index={idx}
        response={state.responses[idx]}
        onAnswer={onAnswer}
        onSkipNS={onSkipNS}
        onBack={onBack}
      />
    );
  }

  if (state.step === 'vote') {
    return (
      <VoteScreen
        value={state.vote}
        onChange={(vote) => setState(s => ({ ...s, vote }))}
        onBack={() => setState(s => ({ ...s, step: 'items', itemIndex: ITEMS.length-1 }))}
        onSeeResults={() => go({ step: 'results' })}
      />
    );
  }

  if (state.step === 'results') {
    return (
      <ResultsScreen
        state={state}
        onRestart={reset}
        onBackToVoting={() => go({ step: 'items', itemIndex: 0 })}
      />
    );
  }

  return null;
}

// ─── Vote / control questions screen ────────────────────────────────────────

function VoteScreen({ value, onChange, onBack, onSeeResults }) {
  const setF = (k, v) => onChange({ ...value, [k]: v });
  const placeOptions = [
    { v:1, label:'Izquierda' },
    { v:2, label:'2' },
    { v:3, label:'Centro' },
    { v:4, label:'4' },
    { v:5, label:'Derecha' },
    { v:'NR', label:'Prefiero no responder' },
  ];

  const intentOptions = [
    ...CANDIDATES.map(c => ({ id: c.id, label: c.name, party: c.party })),
    { id:'otro', label:'Otro candidato', party:'' },
    { id:'blanco', label:'Voto en blanco', party:'' },
    { id:'indeciso', label:'No tengo decidido mi voto', party:'' },
    { id:'pnr', label:'Prefiero no responder', party:'' },
  ];

  return (
    <div>
      <AppHeader stepLabel="04 · Control" />
      <Page footer={
        <div className="space-y-2">
          <PrimaryBtn onClick={onSeeResults}>Ver mis resultados</PrimaryBtn>
          <GhostBtn onClick={onBack}>Atrás</GhostBtn>
        </div>
      }>
        <div className="slide-in">
          <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">Sección 4</div>
          <h2 className="font-serif text-[26px] leading-tight text-ink-900 mb-2">Dos preguntas opcionales</h2>
          <p className="text-[14px] text-ink-700 leading-relaxed mb-6">
            No afectan el cálculo de tu afinidad y puedes saltarlas.
          </p>

          <div className="mb-6">
            <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">Autoubicación política</div>
            <p className="text-[13px] text-ink-700 mb-3">En una escala de 1 a 5, donde 1 es izquierda y 5 es derecha, ¿dónde te ubicas hoy?</p>
            <div className="grid grid-cols-5 gap-2">
              {placeOptions.slice(0,5).map(o => (
                <button key={o.v} onClick={()=>setF('selfPlace', o.v)}
                  className={"py-3 rounded-xl border text-[13px] transition " +
                    (value.selfPlace===o.v
                      ? 'bg-ink-900 text-paper border-ink-900'
                      : 'bg-paper border-ink-100 hover:border-ink-700')}>
                  <div className="font-mono text-[11px] opacity-70">{o.v}</div>
                  <div className="text-[11.5px] mt-0.5 leading-tight">{o.label}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setF('selfPlace', 'NR')}
              className={"mt-2 w-full py-2 rounded-lg text-[12.5px] " +
                (value.selfPlace==='NR' ? 'bg-ink-900 text-paper' : 'text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4')}>
              Prefiero no responder
            </button>
          </div>

          <div className="mb-6">
            <div className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">Intención de voto</div>
            <p className="text-[13px] text-ink-700 mb-3">Pensando en las elecciones presidenciales del 31 de mayo de 2026, ¿por cuál candidato votarías hoy?</p>
            <div className="space-y-2">
              {intentOptions.map(o => (
                <ChoiceCard key={o.id} selected={value.intent===o.id} onClick={()=>setF('intent', o.id)}>
                  <span>{o.label}</span>
                  {o.party && <span className="text-ink-500 text-[12px] block">{o.party}</span>}
                </ChoiceCard>
              ))}
            </div>
          </div>

          <p className="text-[11.5px] text-ink-500">
            Esta pregunta es opcional y no afecta el cálculo de tu afinidad. Su único propósito es permitir al Instituto CAPAZ analizar agregadamente la brecha entre afinidad declarada e intención de voto.
          </p>
        </div>
      </Page>
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
