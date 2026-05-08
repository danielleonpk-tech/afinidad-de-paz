// UI primitives — botones, header, progreso, tarjetas

const { useState, useEffect, useMemo, useRef } = React;

const Logo = ({ className='' }) => (
  <div className={"flex items-center gap-2.5 "+className}>
    <img src="assets/capaz-logo.png" alt="Instituto CAPAZ" className="h-8 w-auto select-none" draggable="false" />
  </div>
);

const Stamp = ({ children, tone='ink' }) => (
  <span className={"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] uppercase tracking-[0.14em] font-medium " +
    (tone==='ink' ? 'bg-ink-900 text-paper' :
     tone==='soft' ? 'bg-ink-50 text-ink-700 border border-ink-100' :
     'bg-olive-500/15 text-olive-600 border border-olive-500/30')}>
    {children}
  </span>
);

const Hairline = ({ className='' }) => <div className={"h-px bg-ink-100 "+className}></div>;

// Top bar with logo + step indicator
function AppHeader({ stepLabel, onExit }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-paper/85 border-b border-ink-100">
      <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-500">
          {stepLabel && <span>{stepLabel}</span>}
        </div>
      </div>
    </header>
  );
}

// Progress bar for the 16-item phase
function ProgressBar({ current, total }) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="px-5 pt-3 pb-2 max-w-md mx-auto w-full">
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.16em] text-ink-500 mb-1.5">
        <span>Ítem {current} <span className="text-ink-300">de</span> {total}</span>
        <span className="font-mono text-ink-700">{Math.round(pct)}%</span>
      </div>
      <div className="h-[3px] w-full bg-ink-100 rounded-full overflow-hidden">
        <div className="pf h-full bg-ink-900" style={{ width: pct + '%' }}></div>
      </div>
    </div>
  );
}

// Page shell, mobile-first column
function Page({ children, footer, className='' }) {
  return (
    <div className={"min-h-[100svh] flex flex-col "+className}>
      <main className="flex-1 max-w-md w-full mx-auto px-5 py-5">{children}</main>
      {footer && (
        <div className="sticky bottom-0 bg-gradient-to-t from-paper via-paper/95 to-paper/0 pt-4">
          <div className="max-w-md mx-auto px-5 pb-5">{footer}</div>
        </div>
      )}
    </div>
  );
}

const PrimaryBtn = ({ children, onClick, disabled, className='' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={"w-full py-3.5 rounded-xl bg-ink-900 text-paper font-medium text-[15px] tracking-[0.01em] " +
      "transition active:scale-[.99] disabled:bg-ink-300 disabled:text-paper/80 disabled:cursor-not-allowed " +
      "hover:bg-ink-800 ring-focus " + className}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, className='' }) => (
  <button onClick={onClick}
    className={"w-full py-3 rounded-xl bg-transparent text-ink-700 font-medium text-[14px] " +
      "border border-ink-100 hover:bg-ink-50 transition ring-focus " + className}>
    {children}
  </button>
);

const TextBtn = ({ children, onClick, className='' }) => (
  <button onClick={onClick}
    className={"text-[13px] underline decoration-ink-300 underline-offset-4 hover:text-ink-900 text-ink-500 ring-focus " + className}>
    {children}
  </button>
);

// Selectable card (radio) for forms
function ChoiceCard({ selected, onClick, children, badge }) {
  return (
    <button onClick={onClick}
      className={"w-full text-left px-4 py-3 rounded-xl border transition flex items-center gap-3 " +
        (selected
          ? 'bg-ink-900 text-paper border-ink-900'
          : 'bg-paper text-ink-900 border-ink-100 hover:border-ink-300') }>
      <span className={"shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center " +
        (selected ? 'border-paper' : 'border-ink-300')}>
        {selected && <span className="block w-1.5 h-1.5 rounded-full bg-paper"></span>}
      </span>
      <span className="flex-1 text-[14.5px]">{children}</span>
      {badge && <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">{badge}</span>}
    </button>
  );
}

// Multi-select card (checkbox-style) — used for priorización
function MultiCard({ selected, disabled, onClick, title, sub, letter }) {
  return (
    <button onClick={onClick} disabled={disabled && !selected}
      className={"w-full text-left p-4 rounded-xl border transition flex items-start gap-3 " +
        (selected
          ? 'bg-ink-900 text-paper border-ink-900'
          : disabled
            ? 'bg-paper text-ink-300 border-ink-100 cursor-not-allowed'
            : 'bg-paper text-ink-900 border-ink-100 hover:border-ink-700')}>
      <span className={"shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 " +
        (selected ? 'border-paper bg-paper text-ink-900' : 'border-ink-300')}>
        {selected && (
          <svg viewBox="0 0 16 16" className="w-3 h-3"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={"font-mono text-[11px] tracking-[0.1em] " + (selected ? 'text-paper/70' : 'text-ink-500')}>{letter}</span>
          <span className="font-medium text-[14.5px] leading-tight">{title}</span>
        </div>
        <p className={"text-[12.5px] mt-1 " + (selected ? 'text-paper/75' : 'text-ink-500')}>{sub}</p>
      </div>
    </button>
  );
}

// Likert button — vertical list, accessible
function LikertButton({ value, label, selected, onClick }) {
  return (
    <button onClick={onClick}
      className={"likert-btn w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition " +
        (selected
          ? 'bg-ink-900 text-paper border-ink-900 shadow-sm'
          : 'bg-paper text-ink-900 border-ink-100 hover:border-ink-700')}>
      <span className={"shrink-0 w-7 h-7 rounded-full grid place-items-center font-mono text-[12px] " +
        (selected ? 'bg-paper text-ink-900' : 'bg-ink-50 text-ink-700')}>{value}</span>
      <span className="text-[14.5px] flex-1">{label}</span>
      {selected && (
        <svg viewBox="0 0 16 16" className="w-4 h-4 check-rise"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </button>
  );
}

// Bar with animated fill — used in results
function ResultBar({ value, max=100, color='#161B22', delayMs=0, height='h-3' }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(Math.max(0, Math.min(100, (value/max)*100))), delayMs);
    return () => clearTimeout(id);
  }, [value, max, delayMs]);
  return (
    <div className={"w-full bg-ink-100 rounded-full overflow-hidden "+height}>
      <div className="h-full pf rounded-full" style={{ width: w + '%', background: color }}></div>
    </div>
  );
}

// Footer with disclaimer text
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/40 fade-in" onClick={onClose}></div>
      <div className="relative w-full sm:max-w-md bg-paper rounded-t-2xl sm:rounded-2xl border-t sm:border border-ink-100 shadow-xl max-h-[85svh] flex flex-col slide-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100">
          <h3 className="font-serif text-[18px] text-ink-900">{title}</h3>
          <button onClick={onClose} aria-label="Cerrar"
            className="w-8 h-8 grid place-items-center rounded-full text-ink-500 hover:bg-ink-50 hover:text-ink-900">
            <svg viewBox="0 0 16 16" className="w-4 h-4"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 text-[13.5px] leading-relaxed text-ink-800">
          {children}
        </div>
        <div className="px-5 py-3 border-t border-ink-100">
          <PrimaryBtn onClick={onClose}>Entendido</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

function FootDisclaimer() {
  return (
    <p className="text-[11px] leading-relaxed text-ink-500 mt-6">
      Instrumento elaborado por el <span className="text-ink-700 font-medium">Instituto Colombo-Alemán para la Paz (CAPAZ)</span>.
      No es una encuesta de intención de voto ni una recomendación electoral. Versión 1.1 — pretest mayo 2026.
    </p>
  );
}

Object.assign(window, {
  Logo, Stamp, Hairline, AppHeader, ProgressBar, Page,
  PrimaryBtn, GhostBtn, TextBtn,
  ChoiceCard, MultiCard, LikertButton, ResultBar, FootDisclaimer, Modal
});
