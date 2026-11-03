import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../asset.js';
import DocumentViewer from '../components/DocumentViewer.jsx';
import PageSelectorModal from '../components/PageSelectorModal.jsx';
import PagesDrawer from './PagesDrawer.jsx';
import Toast from './Toast.jsx';
import { DEFAULT_SELECTION, TOTAL_PAGES } from '../data.js';
import './mobile.css';

// Main Content mobile: padding 16px horizontal / 8px vertical y gap 8px.
const MOBILE_FIT = { paddingX: 32, paddingY: 16, gap: 8 };

const ACTIONS = [
  { id: 'tamano', label: ['Tamaño', 'de firma'], icon: 'm/tamano.svg' },
  { id: 'paginas', label: ['Páginas', 'a firmar'], icon: 'm/paginas.svg' },
  { id: 'visibilidad', label: ['Visibilidad', 'de la firma'], icon: 'm/visibilidad.svg' },
  { id: 'reordenar', label: ['Reordenar', 'datos'], icon: 'm/reordenar.svg' },
  { id: 'logo', label: ['Agregar', 'logo/sello'], icon: 'm/logo.svg' },
  { id: 'permisos', label: ['Permisos', 'de firma'], icon: 'm/permisos.svg' },
];

const sameSet = (a, b) => a.size === b.size && [...a].every((n) => b.has(n));

/** Indicador de scroll horizontal de la barra de acciones (track 6px, thumb proporcional). */
function useScrollIndicator(ref) {
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const width = Math.max(32, (el.clientWidth / el.scrollWidth) * el.clientWidth);
      setThumb({ width, left: max > 0 ? (el.scrollLeft / max) * (el.clientWidth - width) : 0 });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref]);
  return thumb;
}

/**
 * Flujo mobile (360×800): Páginas → drawer "Páginas a firmar" (vacío o con resumen)
 * → selector en bottom sheet → Guardar → toast. Todo lo del drawer es borrador hasta Guardar.
 */
export default function MobileApp() {
  const [saved, setSaved] = useState(() => new Set(DEFAULT_SELECTION));
  const [savedSame, setSavedSame] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState(() => new Set());
  const [draftSame, setDraftSame] = useState(true);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const openerRef = useRef(null);
  const pagesBtnRef = useRef(null);
  const actionsRef = useRef(null);
  const thumb = useScrollIndicator(actionsRef);
  const hasChanges = !sameSet(draft, saved) || draftSame !== savedSame;

  const openPages = () => {
    setDraft(new Set(saved));
    setDraftSame(savedSame);
    setDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    requestAnimationFrame(() => pagesBtnRef.current?.focus());
  }, []);

  const closeSelector = useCallback(() => {
    setSelectorOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  const confirmSelector = useCallback(
    (sel) => {
      setDraft(new Set(sel));
      closeSelector();
    },
    [closeSelector]
  );

  const removePage = (n) =>
    setDraft((prev) => {
      const next = new Set(prev);
      next.delete(n);
      return next;
    });

  const save = () => {
    setSaved(new Set(draft));
    setSavedSame(draftSame);
    closeDrawer();
    const n = draft.size;
    setToast({
      title: `Ubicaste la firma en ${n} ${n === 1 ? 'página' : 'páginas'}`,
      description:
        n === 1 ? `En la página ${[...draft][0]}` : draftSame ? 'Todas en la misma posición' : 'Revisá la ubicación en cada página',
    });
  };

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <div className="m-app">
      <header className="m-header">
        <button className="m-icon-btn" type="button" aria-label="Volver">
          <img src={asset('arrow-back.svg')} alt="" />
        </button>
        <h1 className="m-header__title">Configurar firma</h1>
        <button className="m-icon-btn" type="button" aria-label="Cerrar">
          <img src={asset('close.svg')} alt="" />
        </button>
      </header>

      <main className="m-main">
        <DocumentViewer
          zoom={zoom}
          onZoom={setZoom}
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onSelectPage={setCurrentPage}
          fit={MOBILE_FIT}
        />
      </main>

      <footer className="m-bottom">
        <div className="m-actions-wrap">
        <nav className="m-actions" ref={actionsRef} aria-label="Configuración de la firma">
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              ref={a.id === 'paginas' ? pagesBtnRef : undefined}
              className="m-action"
              type="button"
              onClick={a.id === 'paginas' ? openPages : undefined}
            >
              <img className="m-action__icon" src={asset(a.icon)} alt="" />
              <span className="m-action__label">
                {a.label[0]}
                <br />
                {a.label[1]}
              </span>
            </button>
          ))}
        </nav>
          <div className="m-actions__track" aria-hidden="true">
            <span className="m-actions__thumb" style={{ width: thumb.width, transform: `translateX(${thumb.left}px)` }} />
          </div>
        </div>
        <div className="m-cta">
          <button className="btn btn--primary btn--md" type="button">
            Continuar
          </button>
        </div>
      </footer>

      {toast && <Toast title={toast.title} description={toast.description} onClose={hideToast} />}

      {drawerOpen && !selectorOpen && (
        <PagesDrawer
          draft={draft}
          samePosition={draftSame}
          onSamePositionChange={setDraftSame}
          onOpenSelector={() => setSelectorOpen(true)}
          onRemove={removePage}
          onClear={() => setDraft(new Set())}
          canSave={draft.size > 0 && hasChanges}
          onSave={save}
          onClose={closeDrawer}
          openerRef={openerRef}
        />
      )}

      {selectorOpen && (
        <PageSelectorModal
          variant="sheet"
          title="Páginas a firmar"
          requireChange
          initialSelected={draft}
          onCancel={closeSelector}
          onConfirm={confirmSelector}
        />
      )}
    </div>
  );
}
