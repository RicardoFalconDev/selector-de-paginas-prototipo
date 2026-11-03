import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import DocumentViewer from './components/DocumentViewer.jsx';
import ConfigPanel from './components/ConfigPanel.jsx';
import PageSelectorModal from './components/PageSelectorModal.jsx';
import MobileApp from './mobile/MobileApp.jsx';
import { DEFAULT_SELECTION, TOTAL_PAGES } from './data.js';

const MOBILE_QUERY = '(max-width: 600px)';

/** true cuando el viewport es mobile; se actualiza al redimensionar. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

const VIEWS = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' },
];

/** Vista elegida en el link (#desktop / #mobile); por defecto, desktop. */
function useHashView() {
  const read = () => (window.location.hash === '#mobile' ? 'mobile' : 'desktop');
  const [view, setView] = useState(read);
  useEffect(() => {
    const onHash = () => setView(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const change = (next) => {
    window.location.hash = next;
  };
  return [view, change];
}

/**
 * Prototipo combinado: en pantallas chicas muestra mobile a pantalla completa;
 * en escritorio, una barra para alternar entre la vista desktop y la mobile (en un marco de 360×800).
 */
export default function App() {
  const isMobileDevice = useIsMobile();
  const [view, setView] = useHashView();

  if (isMobileDevice) return <MobileApp />;

  return (
    <div className="shell">
      <div className="shell__bar">
        <span className="shell__title">Selector de páginas · Prototipo</span>
        <div className="shell__switch" role="tablist" aria-label="Vista">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={`shell__tab${view === v.id ? ' shell__tab--active' : ''}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="shell__stage">
        {view === 'desktop' ? (
          <DesktopApp />
        ) : (
          <div className="device" aria-label="Vista mobile 360×800">
            <MobileApp />
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopApp() {
  const [selected, setSelected] = useState(() => new Set(DEFAULT_SELECTION));
  const [modalOpen, setModalOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [samePosition, setSamePosition] = useState(true);
  const openerRef = useRef(null);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  const confirm = useCallback(
    (draft) => {
      setSelected(new Set(draft));
      closeModal();
    },
    [closeModal]
  );

  const removePage = (n) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(n);
      return next;
    });

  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} />
        <main className="workspace">
          <DocumentViewer
            zoom={zoom}
            onZoom={setZoom}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onSelectPage={setCurrentPage}
          />
          <ConfigPanel
            pagesOpen={pagesOpen}
            onTogglePages={() => setPagesOpen((o) => !o)}
            selected={selected}
            openerRef={openerRef}
            onOpen={() => setModalOpen(true)}
            onRemove={removePage}
            onClear={() => setSelected(new Set())}
            samePosition={samePosition}
            onSamePositionChange={setSamePosition}
          />
        </main>
      </div>

      {modalOpen && <PageSelectorModal initialSelected={selected} onCancel={closeModal} onConfirm={confirm} />}
    </div>
  );
}
